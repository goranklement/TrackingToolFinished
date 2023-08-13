import { useState } from "react";
import { InputText } from "primereact/inputtext";
const SavedTask = (props) => {
  const { description, timer, date, onDelete, index, onEditDescription } =
    props;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const handleDescChange = (e) => {
    setEditText(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveDescription = () => {
    onEditDescription(editText, timer, date, description);
    setIsEditing(false);
    setEditText("");
  };

  const handleDelete = async () => {
    try {
      onDelete(description, timer, date);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="savedTask">
      <div className="first">
        <h3>{date}</h3>
      </div>
      {isEditing ? (
        <span className="p-input-icon-right">
          <i
            className="pi pi-check-circle"
            onClick={handleSaveDescription}
            style={{ fontSize: "24px" }}
          />
          <InputText
            className="editdesc"
            placeholder="Enter new description"
            value={editText}
            onChange={handleDescChange}
          />
        </span>
      ) : (
        <div className="second">
          <h3>{description}</h3>
        </div>
      )}

      <div className="third">
        <h3>{timer}</h3>
      </div>
      <div className="forth">
        <i
          className="pi pi-pencil"
          onClick={handleEdit}
          style={{
            fontSize: "1.5rem",
            color: isEditing ? "#11ad33" : "#5F6B8A",
          }}
        ></i>
        <i
          className="pi pi-trash"
          onClick={handleDelete}
          style={{ fontSize: "1.5rem" }}
        ></i>
      </div>
    </div>
  );
};
export default SavedTask;
