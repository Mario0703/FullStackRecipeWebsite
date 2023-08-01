from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
import os
from flask_login import UserMixin
from datetime import timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)
app.secret_key = "hello"
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
UPLOAD_FOLDER = 'F:\Programmerings Hobby\Recipe\Recipe Project\SavedRecipe Images'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app, supports_credentials=True)

app.permanent_session_lifetime = timedelta(minutes=5)

class Testb7(db.Model):
    name = db.Column(db.String,primary_key=True)
    ingredients_string = db.Column(db.String)
    ImagePath = db.Column(db.String)
    decription = db.Column(db.String)
    first_name = db.Column(db.String)
    id = db.Column(db.String)

class Users2(db.Model,UserMixin):
    id = db.Column(db.String, primary_key=True)
    User_Name = db.Column(db.String(20), unique=True)
    User_email = db.Column(db.String(80))
    User_Password = db.Column(db.String(80))

class MessageLogs9(db.Model):
    Content = db.Column(db.String,primary_key=True)
    Message_ID = db.Column(db.String)
    Recipe_ID = db.Column(db.String,primary_key=True)

@app.route("/View", methods=["GET"])
def View():    
    Querry = Testb7.query.all()
    Querry2 = MessageLogs9.query.all()
    Querry3 = Users2.query.all()

    for Datapoints in Querry:
        print(Datapoints.ImagePath)
        print(Datapoints.name)
        print(Datapoints.ingredients_string)
        print(Datapoints.id)
        print(Datapoints.decription)
        print(Datapoints.first_name)
    for Datapoints2 in Querry2:
        print(Datapoints2.Message_ID)
        print(Datapoints2.Content)
    for Datapoints3 in Querry3:
        print("Email:",Datapoints3.User_email)
        print("Pass:",Datapoints3.User_Password)
    return "data has been rendered"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/SubmitComment", methods = ["POST"])
def SubmitComment():
    data = request.get_json()
    Id = data.get("recipeId")
    content = data.get("messageString")
    MessageID = data.get("MessageID")
    MessageDB = MessageLogs9(Content=content,Recipe_ID=Id,Message_ID=MessageID )
    db.session.add(MessageDB)
    db.session.commit()
    return "Data has been added to the database"

@app.route("/RetriveRecipe_id",methods=["POST"])
def GetID():
    if request.method == "POST":
        DATA = request.get_json() 
        Send_Recipe_id = DATA.get("recipeId")
        return jsonify(Send_Recipe_id)
    


@app.route("/GetComment/<ID>", methods=["GET"])
def RetrieveComments(ID):
    data = []
    messages = MessageLogs9.query.all()
    for message in messages:
        if str(ID) == str(message.Recipe_ID):  # Comparing as strings to handle potential data type mismatches
            data.append({"Message": message.Content, "Recipe_ID": message.Recipe_ID, "MessageID": message.Message_ID})
    return jsonify(data)
        

    

@app.route('/SubmitRecipe',methods = ['POST'])
def submit():
    Name = request.form["recipeName"]
    list = request.form["ingredientList"]
    ID = request.form["RecipeID"]
    file = request.files["file"]
    Decription = request.form["Decription"]
    First_name = request.form["First-name"]
    
    if file and allowed_file(file.filename):
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        PathToimage = f"{UPLOAD_FOLDER}\{file.filename}"

        new_recipe = Testb7(name=Name,ingredients_string=list,ImagePath=PathToimage, id=ID, decription=Decription, first_name=First_name)
        
        db.session.add(new_recipe)
        db.session.commit()
        
        return "Succes!"
    else:
        return "Post request has faild"

@app.route("/DeleteComment", methods=["DELETE"])
def DeleteComment():
    data = request.get_json()
    Message_To_Delete = data.get("MessageID")
    message_to_delete = MessageLogs9.query.filter_by(Message_ID=Message_To_Delete).first()
    
    if Message_To_Delete: 
        db.session.delete(message_to_delete)
        db.session.commit()
        return "Data has been deleted"
    else:
         return "Faild, data has not been deleteed"

@app.route("/login",methods=["POST", "GET"])
def ConfirmLogin():
    user_email = request.form["Email"]
    user_password = request.form["Password"]
    queery = Users2.query.all()
    user = Users2.query.filter_by(User_email=user_email, User_Password=user_password).first()
    print(queery,user, user_email, user_password)
    if user:
        session["username"] = user_email
        print(session["username"])
        return (session["username"])
        
    else:
        # User doesn't exist or credentials are incorrect
        return jsonify({"message": "Invalid email or password"})

@app.route("/check_login", methods=["GET"])
def check_login():
    if "username" in session:
        name = session.get("username")
        return jsonify(name)
    else:
        return "No user logged in!"

@app.route("/CreateUser", methods=["POST"])
def CreateUser():
    data = request.get_json()
    Name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    User_ID = data.get('User_ID')
    print(email)
    New_User = Users2(id=User_ID,User_Name=Name,User_email=email,User_Password=password)
    db.session.add(New_User)
    db.session.commit()
    return "User Created"            
    

@app.route("/ChangeComment", methods=["PUT"])
def ChangeContent():
    data = request.get_json()
    Id_Of_Message = data.get("MessageID")
    editedPost = data.get("editedPost")
    Id_Of_Recipe = data.get("recipeId")
    query = MessageLogs9.query.filter_by(Message_ID = Id_Of_Message).first()
    if (query):
        query.Content = editedPost
        db.session.commit()
        return "Change complete"

    return "Message not found"

@app.route ('/GetRecipeData', methods=['GET'])
def RetriveData():
    recipes = Testb7.query.all()
    data_list = [{"name": recipe.name, "ingredients_string": recipe.ingredients_string, "ImagePath": recipe.ImagePath, "ID": recipe.id, "First_name": recipe.first_name,"Desription": recipe.decription} for recipe in recipes]
    return jsonify(data_list )


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)