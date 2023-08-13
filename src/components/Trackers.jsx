import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Button } from "primereact/button";
import NewTask from "./NewTask";
import { db } from "./FirebaseConfig";

import { Paginator } from "primereact/paginator";

import { doc, getDoc } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { deleteField } from "firebase/firestore";

import { Calendar } from "primereact/calendar";

import { Toast } from "primereact/toast";

import { InputText } from "primereact/inputtext";
import { auth } from "./FirebaseConfig";

const Trackers = () => {
  const [taskList, setTaskList] = useState([]);
  const toast = useRef(null);
  const [date, setDate] = useState(null);
  const [isEditing, setEditingIndex] = useState(false);
  const [isDescVisible, setIsDescVisible] = useState(false);
  const [description, setDescription] = useState("");

  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [stoppedTasks, setStoppedTasks] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(3);

  const user = auth.currentUser;

  const activeTasksRef = doc(db, "tasks", user.uid);
  const savedTasksRef = doc(db, "tasks", user.uid + "S");
  const activeIndexRef = doc(db, "activeIndex", user.uid);

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getExistingTasks = async () => {
    const docSnap = await getDoc(activeTasksRef);
    if (docSnap.exists != true) {
      await setDoc(activeIndexRef, {
        tasks: [],
      });
    }

    if (docSnap.exists()) {
      setTaskList(docSnap.data().tasks);
      setActiveTaskIndex(taskList.length - 1);
    } else {
      showError("Error during reading data from database!");
    }
  };

  useEffect(() => {
    getExistingTasks();
  }, []);

  useEffect(() => {
    if (activeTaskIndex !== null && taskList !== undefined) {
      const timerInterval = setInterval(async () => {
        setTaskList((prevTasks) =>
          prevTasks.map((task, index) => {
            if (index === activeTaskIndex) {
              const updatedTask = { ...task, timer: task.timer + 1 };
              updateDoc(activeTasksRef, {
                tasks: prevTasks.map((prevTask, i) =>
                  i === index ? updatedTask : prevTask
                ),
              });
              return updatedTask;
            }
            return task;
          })
        );
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [activeTaskIndex]);

  const newTimer = () => {
    setIsDescVisible(!isDescVisible);
  };

  const addNewToDatabase = async () => {
    const task = {
      timer: 0,
      date:
        date.getDate() +
        "." +
        (date.getMonth() + 1) +
        "." +
        date.getFullYear() +
        ".",
      description: description,
    };

    const activeTasksRef = doc(db, "tasks", user.uid);
    const activeIndexRef = doc(db, "activeIndex", user.uid);

    await updateDoc(activeTasksRef, {
      tasks: arrayUnion(task),
    });

    const docSnap = await getDoc(activeTasksRef);

    setTaskList(docSnap.data().tasks);
    await setDoc(activeIndexRef, {
      index: docSnap.data().tasks.length,
    });
    const indexSnap = await getDoc(activeIndexRef);
    setActiveTaskIndex(indexSnap.data().index - 1);
  };

  const handleUpdateDescription = async (index, newDescription) => {
    try {
      const taskRef = doc(db, "tasks", user.uid);
      const docSnap = await getDoc(taskRef);
      const data = docSnap.data();

      const updatedTasks = data.tasks.map((task, i) => {
        if (i === index) {
          return { ...task, description: newDescription };
        }
        return task;
      });

      await updateDoc(taskRef, { tasks: updatedTasks });

      setTaskList(updatedTasks);
      showSuccess("Task description updated successfully!");
    } catch (error) {
      showError("Error during updating task description.");
    }
  };
  const handleStopTask = async (taskData, index) => {
    const updatedTaskList = taskList.filter((task, i) => i !== index);

    const activeTasksRef = doc(db, "tasks", user.uid);

    await updateDoc(activeTasksRef, {
      tasks: updatedTaskList,
    });
    setTaskList(updatedTaskList);
    await updateDoc(savedTasksRef, {
      tasks: arrayUnion(taskData),
    });
    if (index === activeTaskIndex) setActiveTaskIndex(null);
    if (index < activeTaskIndex) {
      setActiveTaskIndex(activeTaskIndex - 1);
    }
  };

  const stopAllTimers = async () => {
    if (taskList !== undefined && taskList.length > 0) {
      await updateDoc(savedTasksRef, {
        tasks: arrayUnion(
          ...taskList.map((task) => {
            task.timer = formatTime(task.timer);
            return task;
          })
        ),
      });

      await updateDoc(activeTasksRef, {
        tasks: deleteField(),
      });
      window.location.reload(false);
    } else {
      showError("There is no tasks to stop!");
    }
  };

  const handleDeleteTask = async (index) => {
    try {
      const taskRef = doc(db, "tasks", user.uid);

      const docSnap = await getDoc(taskRef);
      const data = docSnap.data();
      const updatedTasks = data.tasks.filter((task, i) => i !== index);

      await updateDoc(taskRef, { tasks: updatedTasks });

      setTaskList(updatedTasks);
      showSuccess("Task deleted successfully!");
      setDescription("");
      if (index === activeTaskIndex) setActiveTaskIndex(null);
      if (index < activeTaskIndex) {
        setActiveTaskIndex(activeTaskIndex - 1);
      }
    } catch (error) {
      showError("Error during deleting task happened.");
    }
  };

  const handleEditDescription = (index) => {
    setEditingIndex(!isEditing);
  };

  const addNewTask = () => {
    if (description === "" || date === null) {
      showError("You have to pick date and enter description");
    } else {
      addNewToDatabase();
      setDescription("");
      showSuccess("Task added successfully!");
    }
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const showError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <div className="trackersContainer">
      <Toast ref={toast} />
      <div className="upperContainer">
        <div className="create">
          <Calendar
            className="calendar"
            value={date}
            onChange={(e) => setDate(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>

        <div className="buttons">
          <Button
            className="btnStart"
            label="Start new timer"
            onClick={newTimer}
            icon="pi pi-stopwatch"
            style={{
              width: "170px",
              height: "36px",
              backgroundColor: "#FF5722",
              borderRadius: "3px",
              border: "1px solid var(--orange, #FF5722)",
              flexShrink: "0",
            }}
          />
          <Button
            className="btnStop"
            label="Stop all"
            icon="pi pi-stop-circle"
            onClick={stopAllTimers}
            style={{
              width: "170px",
              height: "36px",
              flexShrink: "0",
              backgroundColor: "#181846",
              borderRadius: "3px",
              border: "1px solid var(--port-gore, #181846)",
              marginLeft: "15px",
            }}
          />
        </div>
        {isDescVisible && (
          <div className="newInput">
            <span className="p-input-icon-right">
              <i
                onClick={addNewTask}
                className="pi  pi-check-circle"
                style={{ fontSize: "1.7rem" }}
              />
              <InputText
                className="p-inputtext-lg"
                placeholder="Enter description"
                value={description}
                onChange={handleDescriptionChange}
                style={{
                  width: "500px",
                  height: "70px",
                }}
              />
            </span>
          </div>
        )}
      </div>
      <svg
        width="1170"
        height="70"
        viewBox="0 0 1170 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.25 8C0.25 3.71979 3.71979 0.25 8 0.25H1162C1166.28 0.25 1169.75 3.71979 1169.75 8V69.75H0.25V8Z"
          fill="#F9F9FD"
          stroke="#ECEDF5"
          strokeWidth="0.5"
        />
        <text x="30" y="45">
          Time logged
        </text>
        <text x="250" y="45">
          Description
        </text>
        <text x="970" y="45">
          Actions
        </text>
      </svg>
      <div>
        {taskList !== undefined ? (
          taskList.slice(first, first + rows).map((task, index) => {
            return (
              <NewTask
                key={index + first}
                date={task.date}
                isEditing={isEditing}
                timer={formatTime(task.timer)}
                description={task.description}
                isActive={index + first === activeTaskIndex}
                onDelete={() => handleDeleteTask(index + first)}
                onEditDescription={() => handleEditDescription(index + first)}
                onUpdateDescription={(newDescription) =>
                  handleUpdateDescription(index + first, newDescription)
                }
                index={index + first}
                onStop={(taskData) => handleStopTask(taskData, index + first)}
                setActiveTaskIndex={setActiveTaskIndex}
              />
            );
          })
        ) : (
          <h3 style={{ color: "black" }}>You don't have any tasks</h3>
        )}

        <Paginator
          className="paginator"
          first={first}
          rows={rows}
          totalRecords={taskList != undefined ? taskList.length : 0}
          rowsPerPageOptions={[3, 6, 9]}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
export default Trackers;
