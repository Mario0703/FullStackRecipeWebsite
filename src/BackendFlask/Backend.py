# Import necessary modules and packages
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
import os
from flask_login import UserMixin
from datetime import timedelta

# Initialize the Flask app
app = Flask(__name__)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
db = SQLAlchemy(app)

# Set the app's secret key and session configurations
app.secret_key = "hello"
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True

# Set up file upload configurations
UPLOAD_FOLDER = 'F:\Programmerings Hobby\Recipe\Recipe Project\SavedRecipe Images'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app, supports_credentials=True)

# Set the session lifetime
app.permanent_session_lifetime = timedelta(minutes=30)

# Define the RecipeDB1 model
class RecipeDB1(db.Model):
    name = db.Column(db.String, primary_key=True)
    ingredients_string = db.Column(db.String)
    ImagePath = db.Column(db.String)
    decription = db.Column(db.String)
    first_name = db.Column(db.String)
    AUTHOR_ID = db.Column(db.String)
    id = db.Column(db.String)

# Define the UsersDB model
class UsersDB(db.Model, UserMixin):
    id = db.Column(db.String, primary_key=True)
    User_Name = db.Column(db.String(20), unique=True)
    User_email = db.Column(db.String(80))
    User_Password = db.Column(db.String(80))

# Define the MessagesDB model
class MessagesDB(db.Model):
    Content = db.Column(db.String, primary_key=True)
    Message_ID = db.Column(db.String)
    Recipe_ID = db.Column(db.String, primary_key=True)

# Debug route to view data from the database
@app.route("/View", methods=["GET"])
def View():    
    # Query data from different tables
    Querry = RecipeDB1.query.all()
    Querry2 = MessagesDB.query.all()
    Querry3 = UsersDB.query.all()

    # Print recipe data
    for Datapoints in Querry:
        print(Datapoints.ImagePath)
        print(Datapoints.name)
        print(Datapoints.ingredients_string)
        print(Datapoints.id)
        print(Datapoints.decription)
        print(Datapoints.first_name)
    
    # Print message data
    for Datapoints2 in Querry2:
        print(Datapoints2.Message_ID)
        print(Datapoints2.Content)
    
    # Print user data
    for Datapoints3 in Querry3:
        print("Email:", Datapoints3.User_email)
        print("Pass:", Datapoints3.User_Password)
    
    return "Data has been rendered"

# Function to check if a file has an allowed extension
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to submit a comment
@app.route("/SubmitComment", methods=["POST"])
def SubmitComment():
    data = request.get_json()
    Id = data.get("recipeId")
    content = data.get("messageString")
    MessageID = data.get("MessageID")
    MessageDB = MessagesDB(Content=content, Recipe_ID=Id, Message_ID=MessageID)
    db.session.add(MessageDB)
    db.session.commit()
    return "Data has been added to the database"

# Route to retrieve a recipe ID
@app.route("/RetriveRecipe_id", methods=["POST"])
def GetID():
    if request.method == "POST":
        DATA = request.get_json() 
        Send_Recipe_id = DATA.get("recipeId")
        return jsonify(Send_Recipe_id)

# Route to get comments for a specific recipe ID
@app.route("/GetComment/<ID>", methods=["GET"])
def RetrieveComments(ID):
    data = []
    messages = MessagesDB.query.all()
    
    # Fetch comments for the specified recipe ID
    for message in messages:
        if str(ID) == str(message.Recipe_ID):  # Comparing as strings to handle potential data type mismatches
            data.append({"Message": message.Content, "Recipe_ID": message.Recipe_ID, "MessageID": message.Message_ID})
    return jsonify(data)

# Route to submit a new recipe
@app.route('/SubmitRecipe', methods=['POST'])
def submit():
    Name = request.form["recipeName"]
    ingredient_list = request.form["ingredientList"]
    ID = request.form["RecipeID"]
    file = request.files["file"]
    Description = request.form["Decription"]
    First_name = request.form["First-name"]
    
    # Check if the user is logged in
    if "UserID" in session:
        if file and allowed_file(file.filename):
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            PathToimage = f"{UPLOAD_FOLDER}\{file.filename}"
            Author = session.get("UserID")
            
            # Create and add a new recipe to the database
            new_recipe = RecipeDB1(name=Name, ingredients_string=ingredient_list, ImagePath=PathToimage, id=ID, 
                                   decription=Description, first_name=First_name, AUTHOR_ID=Author)
            db.session.add(new_recipe)
            db.session.commit()
            
            return "Success!"
        else:
            return "Post request has failed"
    else:
        return "Must be logged in to post"

# Route to retrieve recipes created by the logged-in user
@app.route("/RetriveUserRecipes", methods=["GET"])
def UserRecipes():
    # Get the current user's ID from the session
    Author = session.get("UserID")
    
    # Query the recipes created by the user
    query = RecipeDB1.query.filter_by(AUTHOR_ID=Author).all()
    if query:
        # Prepare a list of recipe names and IDs
        recipes_list = [{"name": recipe.name, "id": recipe.id} for recipe in query]
        return jsonify(recipes_list)
    else:
        return "No recipes!"

# Route to retrieve user information in JSON format
@app.route("/RetriveUserInformation", methods=["GET"])
def UserinfomationJSON():
    if "username" in session:
        USERID = session.get("UserID")
        
        # Query the user's information based on the retrieved user ID
        UserInfomationRow = UsersDB.query.filter_by(id=USERID).first()
        UserJSON = [{"name": UserInfomationRow.User_Name, "email": UserInfomationRow.User_email}]
        return jsonify(UserJSON)
    else:
        return "User not in session!"

# Route to delete a comment
@app.route("/DeleteComment", methods=["DELETE"])
def DeleteComment():
    data = request.get_json()
    Message_To_Delete = data.get("MessageID")
    message_to_delete = MessagesDB.query.filter_by(Message_ID=Message_To_Delete).first()
    
    if message_to_delete: 
        db.session.delete(message_to_delete)
        db.session.commit()
        return "Data has been deleted"
    else:
         return "Failed, data has not been deleted"

# Route to delete a recipe
@app.route("/DeleteRecipe/<ID>", methods=["DELETE"])
def deleteRecipe(ID):
    recipe_to_delete = RecipeDB1.query.filter_by(id=ID).first()
    
    if recipe_to_delete:
        # Delete associated messages first
        Messeges_To_Recipe = MessagesDB.query.filter_by(Recipe_ID=ID).all()
        for message in Messeges_To_Recipe:
            db.session.delete(message)
            db.session.commit()
        
        # Then delete the recipe
        db.session.delete(recipe_to_delete)
        db.session.commit()
    
    return "The recipe has been deleted"
@app.route("/logout",methods=["POST", "GET"])
def Logout():
    session.clear()
    return "logout"

@app.route("/login",methods=["POST", "GET"])
def ConfirmLogin():
    user_email = request.form["Email"]
    user_password = request.form["Password"]
    queery = UsersDB.query.all()
    user = UsersDB.query.filter_by(User_email=user_email, User_Password=user_password).first()
    print(queery,user, user_email, user_password)
    if user:
        session["username"] = user_email
        session["UserID"] = user.id
        print(session["username"])
        return (session["username"])
        
    else:
        return jsonify({"message": "Invalid email or password"})

@app.route("/check_login", methods=["GET"])
def check_login():
    if "username" in session:
        name = session.get("username")
        Id = session.get("UserID")
        print(Id)
        return jsonify([{"logged_in": True, "name": name}])
    else:
        return  jsonify(logged_in = False)

@app.route("/CreateUser", methods=["POST"])
def CreateUser():
    data = request.get_json()
    Name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    User_ID = data.get('User_ID')
    print(email)
    New_User = UsersDB(id=User_ID,User_Name=Name,User_email=email,User_Password=password)
    db.session.add(New_User)
    db.session.commit()
    return "User Created"            
    

@app.route("/ChangeComment", methods=["PUT"])
def ChangeContent():
    data = request.get_json()
    Id_Of_Message = data.get("MessageID")
    editedPost = data.get("editedPost")
    query = MessagesDB.query.filter_by(Message_ID = Id_Of_Message).first()
    if (query):
        query.Content = editedPost
        db.session.commit()
        return "Change complete"

    return "Message not found"

@app.route ('/GetRecipeData', methods=['GET'])
def RetriveData():
    recipes = RecipeDB1.query.all()
    data_list = [{"name": recipe.name, "ingredients_string": recipe.ingredients_string, "ImagePath": recipe.ImagePath, "ID": recipe.id, "First_name": recipe.first_name,"Desription": recipe.decription} for recipe in recipes]
    return jsonify(data_list )
# ... (remaining routes)

if __name__ == '__main__':
    # Create database tables if not already created and run the app in debug mode
    with app.app_context():
        db.create_all()
    app.run(debug=True)