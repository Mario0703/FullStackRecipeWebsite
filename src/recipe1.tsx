import { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { BasicExample } from "./NavBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface IconProps {
  iconImegaHover: string;
  IconeImageNoHover: string;
  RemoveComment: (postIndex: number) => void;
  ImageDesception: string;
  index: number;
}

const Icons = (props: IconProps) => {
  const {
    index,
    iconImegaHover,
    IconeImageNoHover,
    RemoveComment,
    ImageDesception,
  } = props;
  let [OnHover, SetHover] = useState(false);

  const OnMouse = () => {
    SetHover(true);
  };

  const OnMouseLeave = () => {
    SetHover(false);
  };

  return (
    <img
      onMouseOver={OnMouse}
      onMouseOut={OnMouseLeave}
      onClick={() => RemoveComment(index)}
      src={OnHover ? iconImegaHover : IconeImageNoHover}
      alt={ImageDesception}
      height={"30px"}
      style={{ paddingLeft: "20px", marginTop: "20px" }}
    ></img>
  );
};

uuidv4();
interface JSON_Type {
  Message: string;
  MessageID: string;
  Recipe_ID: string;
}

interface AddCommentProps {
  handleSaveChanges: (editedPost: string, postIndex: number) => void;
  comment: JSON_Type[];
}

const AddComment: React.FC<AddCommentProps> = ({
  comment,
  handleSaveChanges,
}) => {
  const [editedPost, setEditedPost] = useState("");
  const [editModeIndex, setEditModeIndex] = useState<number | null>(null);

  const handleEditString = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPost(e.target.value);
  };

  const enterEditMode = (index: number) => {
    setEditedPost(comment[index].Message);
    setEditModeIndex(index);
  };

  const RemoveComment = async (index: number) => {
    await axios
      .delete("http://localhost:5000/DeleteComment", {
        data: {
          MessageID: comment[index].MessageID,
        },
      })
      .then((response) => console.log(response));
    console.log(comment[index].MessageID);
  };

  const handleEditModeSave = async () => {
    if (editModeIndex !== null) {
      await axios
        .put("http://localhost:5000/ChangeComment", {
          MessageID: comment[editModeIndex].MessageID,
          editedPost,
          recipeId: comment[editModeIndex].Recipe_ID,
        })
        .then((res) => console.log(res.data));
      handleSaveChanges(editedPost, editModeIndex);
      setEditedPost("");
      setEditModeIndex(null);
    }
  };

  return (
    <div>
      <link rel="stylesheet" type="text/css" href="/src/Comments.css"></link>

      {comment.map((post, index) => (
        <div className="Content" key={post.MessageID}>
          <div className="UserInformationParrent">
            <span>Mario Christensen</span>
            <br />
            <span style={{ marginLeft: "20px" }}>@mario_christensen</span>
          </div>
          <div>
            {editModeIndex === index ? (
              <div>
                <input
                  style={{ marginTop: "15px" }}
                  className="form-control"
                  onInput={handleEditString}
                  type="text"
                  value={editedPost}
                />
                <button
                  style={{ marginTop: "15px", marginLeft: "20px" }}
                  className="btn btn-secondary"
                  onClick={handleEditModeSave}
                >
                  Save
                </button>
              </div>
            ) : (
              <div style={{ marginLeft: "20px" }}>
                <div style={{ marginTop: "15px" }} className="post">
                  {post.Message}
                </div>
                <button
                  style={{ marginTop: "20px" }}
                  className="btn btn-primary"
                  onClick={() => enterEditMode(index)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <div>
            <Icons
              ImageDesception="DeleteIcon"
              index={index}
              IconeImageNoHover="/src/Images/MessageIcons/trash-can.png"
              iconImegaHover="/src/Images/MessageIcons/trash-can HighLight.png"
              RemoveComment={() => RemoveComment(index)}
            ></Icons>
          </div>
        </div>
      ))}
    </div>
  );
};

const MessageBoard: React.FC = () => {
  const [messageString, setMessageString] = useState(""); // State for input value
  const [posts, setPosts] = useState<string[]>([]); // State for storing posts
  const { recipeId } = useParams<{ recipeId: string }>();
  const [MessageJSON, setMessageJSON] = useState<JSON_Type[]>([]); // State for storing posts
  const [ID, SETID] = useState(""); // State for storing posts

  // Function to handle input change
  const getInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valueString = e.target.value;
    setMessageString(valueString);
  };

  const GetComments = async () => {
    await axios
      .get(`http://localhost:5000/GetComment/${ID}`)
      .then((response) => setMessageJSON(response.data));
  };
  useEffect(() => {
    const LoadMessages = async () => {
      await axios
        .post("http://localhost:5000/RetriveRecipe_id", {
          recipeId: recipeId,
        })
        .then((res) => SETID(res.data));
    };
    LoadMessages();
    console.log(ID);
  }, []);

  // Function to add a post
  const handleAddPost = async () => {
    const MessageID = uuidv4();

    setPosts([...posts, messageString]);
    setMessageString("");
    await axios
      .post("http://localhost:5000/SubmitComment", {
        messageString,
        MessageID,
        recipeId,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    await axios
      .get("http://localhost:5000/GetComment")
      .then((response) => setMessageJSON(response.data));
  };

  // Function to save changes to a post
  const handleSaveChanges = (editedPost: string, postIndex: number) => {
    const updatedArray = [...posts];
    updatedArray[postIndex] = editedPost;
    setPosts(updatedArray);
  };

  return (
    <div>
      <link rel="stylesheet" type="text/css" href="./src/Comments.css"></link>
      <label>
        <div className="input-group mb-3">
          <div className="input-group-prepend"></div>
          <input
            type="text"
            className="form-control"
            placeholder="Whats on your minde"
            aria-label=""
            aria-describedby="basic-addon1"
            width={"500px"}
            onInput={getInput}
          ></input>
          <button
            onClick={handleAddPost}
            className="btn btn-outline-secondary"
            type="button"
          >
            AddComment
          </button>
          <button onClick={GetComments}>GetComments</button>
        </div>
      </label>
      <AddComment comment={MessageJSON} handleSaveChanges={handleSaveChanges} />
    </div>
  );
};

interface RecipePROPS {
  ID: number;
  Name: string;
  ImagePath: string;
  Description: string;
}

export function removeFilePathPrefix(filePath: string) {
  const regex = /SavedRecipe Images\\(.*)/;
  const match = filePath.match(regex);
  return match ? match[1] : filePath;
}

export function ViewRecipe() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipeName, setRecipeName] = useState("");
  const [ImagePath, SetImagePath] = useState("");
  const [Ingredients, SetIngredients] = useState("");
  const [Description, SetDescription] = useState("");
  const [data, SetData] = useState<[RecipePROPS]>(); // Explicitly define the type as an array of 'Recipe'

  useEffect(() => {
    axios
      .get("http://localhost:5000/GetRecipeData")
      .then((response) => {
        const recipes = response.data;
        SetData(recipes);

        recipes.map((OBJ: any) => {
          if (OBJ.ID === recipeId) {
            setRecipeName(OBJ.name);
            SetIngredients(OBJ.ingredients_string);
            SetDescription(OBJ.Desription);
            const imagePathWithoutPrefix = removeFilePathPrefix(OBJ.ImagePath);
            SetImagePath(imagePathWithoutPrefix);
            console.log(OBJ.Desription, data);
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [recipeId]);

  return (
    <>
      <BasicExample></BasicExample>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "left", maxWidth: "700px" }}>
          <header>
            {" "}
            <h2>{recipeName}</h2>
          </header>
          <img
            src={`/SavedRecipe Images/${ImagePath}`}
            width={"500px"}
            alt="Recipe"
          />
          <h4>{Ingredients}</h4>
          <span>{Description}</span>

          <div></div>
          <h3>Comment Section</h3>
          <MessageBoard />
        </div>
      </div>
      <Footer />
    </>
  );
}
