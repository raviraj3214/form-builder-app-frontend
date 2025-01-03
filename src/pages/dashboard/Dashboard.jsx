import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { FaFolderPlus } from "react-icons/fa";
import { IoAdd, IoArrowBack } from "react-icons/io5";
import { RiArrowDropDownLine, RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Dashboard.module.css";
import {useCreateFolderMutation,useDeleteFolderMutation,useLazyGetUserFoldersQuery,} from "../../../redux/slices/foldersApiSlice"
import { useLazyGetFormsByUserQuery,useGetFormsByFolderQuery, useLazyGetFormsByFolderQuery,useDeleteFormMutation } from "../../../redux/slices/formApiSlice";
import { useLazyGetUserWorkspacesQuery,useShareWorkspaceMutation } from "../../../redux/slices/workspacesApiSlice";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
// import { IoMdArrowDropdown } from "react-icons/io";


function Dashboard({ handleLogout }) {

  const [createFolder] = useCreateFolderMutation()
  const [deleteFolder] = useDeleteFolderMutation()
  const [getUserFolders] = useLazyGetUserFoldersQuery()
  const [getformbyusers] = useLazyGetFormsByUserQuery()
  const [getFormsByFolder] = useLazyGetFormsByFolderQuery()
  const [deleteForm] = useDeleteFormMutation()
  const [getUserWorkspaces] = useLazyGetUserWorkspacesQuery()
  const [shareWorkspace] = useShareWorkspaceMutation()
  const {token,user} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isCreateFolderVisible, setIsCreateFolderVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolderForms, setSelectedFolderForms] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [formToDelete, setFormToDelete] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [folders, setFolders] = useState([]);
  const [forms, setForms] = useState([]);
  const [folderHistory, setFolderHistory] = useState([]); 
  const [isDark, setIsDark] = useState(true);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [permission, setPermissoin] = useState("view");
  const [email, setEmail] = useState();
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");



  useLayoutEffect(() => {
    const handleResize = () => {
      if (dropdownRef.current && buttonRef.current) {
        const buttonWidth = buttonRef.current.offsetWidth;
        dropdownRef.current.style.width = `${buttonWidth}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [buttonRef.current, isDropdownVisible]);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      navigate("/login");
    }
  }, [token]);


  useEffect(() => {
    const fetchWorkspaces = async () => {
        try {
            const response = await getUserWorkspaces().unwrap()
            console.log("respons edashboard", response)
            if (response.success) {
                setWorkspaces(response.workspaces);
            }
        } catch (error) {
            console.error("Error fetching workspaces:", error);
        }
    };

    fetchWorkspaces();
},[]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        
          const fetchedFolders = await getUserFolders().unwrap();
          console.log("data",fetchedFolders)
          setFolders(fetchedFolders.folders);
        
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);
  const toggleTheme = () =>setIsDark(!isDark);


  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (userId) {
          const fetchedForms = await getformbyusers().unwrap();
          setForms(fetchedForms.forms);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, [userId]);

 
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const folderIdFromUrl = urlParams.get("folderId");
    if (folderIdFromUrl) {
      setSelectedFolderId(folderIdFromUrl);
      fetchFormsInFolder(folderIdFromUrl);
    } else {
      setSelectedFolderId(null);
      setSelectedFolderForms([]);
    }
  }, [location.search]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleCreateFolderClick = () => {
    setIsCreateFolderVisible(true);
  };

  

  const handleCreateFolder = async () => {
    try {
      if (folderName.trim()) {
        await createFolder({foldername:folderName}).unwrap();
        setIsCreateFolderVisible(false);
        setFolderName("");
        toast.success("Folder created successfully!");
        const fetchedFolders = await getUserFolders().unwrap();
        setFolders(fetchedFolders.folders);
      } else {
        toast.error("Folder name cannot be empty");
      }
    } catch (error) {
      toast.error(`Error creating folder: ${error.message}`);
    }
  };
  const handleSubmitShare = async () => {
    const data = {
      email:email,
      accessType:permission,
    };

    try {
      const res = await shareWorkspace(data).unwrap();
      console.log("fgcg response", res)
      if (res.message) {
        toast(res.message);
      } 
        
    } catch (error) {
      console.log(error);
      toast(error.data.message);

    }
  };

  const handleCancelCreateFolder = () => {
    setIsCreateFolderVisible(false);
    setFolderName("");
  };

  const handleDeleteFolderClick = (folder) => {
    setFolderToDelete(folder);
    setIsDeletePopupVisible(true);
  };

  


  const handleConfirmDeleteFolder = async () => {
    try {
      if (folderToDelete) {
        await deleteFolder(folderToDelete._id).unwrap();
        toast.success("Folder deleted successfully!");
        const fetchedFolders = await getUserFolders().unwrap();
        setFolders(fetchedFolders.folders);
        if (selectedFolderId === folderToDelete._id) {
          setSelectedFolderId(null);
          setSelectedFolderForms([]);
          navigate(`/dashboard/${userId}`, { replace: true });
        }
        setIsDeletePopupVisible(false);
        setFolderToDelete(null);
      }
    } catch (error) {
      toast.error(`Error deleting folder: ${error.message}`);
    }
  };

  const handleCancelDeleteFolder = () => {
    setIsDeletePopupVisible(false);
    setFolderToDelete(null);
  };

  const handleFormClick = (formId) => {
    navigate(`/dashboard/${userId}/${formId}`);
  };

  const handleCreateNewForm = () => {
    if (selectedFolderId) {
      navigate(`/dashboard/${userId}/${selectedFolderId}/newform`);
    } else {
      navigate(`/dashboard/${userId}/newform`);
    }
  };

  const handleFolderClick = async (folderId) => {
    setFolderHistory((prevHistory) => [...prevHistory, selectedFolderId]);
    setSelectedFolderId(folderId);
    navigate(`/dashboard/${userId}?folderId=${folderId}`, { replace: true });
    fetchFormsInFolder(folderId);
  };

  const fetchFormsInFolder = async (folderId) => {
    try {
      const formsInFolder = await getFormsByFolder(folderId).unwrap();
      setSelectedFolderForms(formsInFolder.forms);
    } catch (error) {
      console.error("Error fetching forms in folder:", error);
      toast.error("Error fetching forms in folder");
    }
  };

  const handleDeleteFormClick = (form) => {
    setFormToDelete(form);
    setIsDeletePopupVisible(true);
  };

  const handleConfirmDeleteForm = async () => {
    try {
      const response = await deleteForm(formToDelete._id).unwrap();
      if(response.message){
      toast.success("Form deleted successfully!");
      
      setIsDeletePopupVisible(false);
      setFormToDelete(null);
      if (selectedFolderId) {
        fetchFormsInFolder(selectedFolderId);
      } else {
        const fetchedForms = await getformbyusers().unwrap();
        setForms(fetchedForms.forms);
      }
    }
    } catch (error) {
      toast.error(`Error deleting form: ${error.message}`);
    }
  };

  const handleCancelDeleteForm = () => {
    setIsDeletePopupVisible(false);
    setFormToDelete(null);
  };

  const handleBackClick = () => {
    if (folderHistory.length > 0) {
      const previousFolderId = folderHistory[folderHistory.length - 1];
      setFolderHistory((prevHistory) => prevHistory.slice(0, -1));
      if (previousFolderId) {
        setSelectedFolderId(previousFolderId);
        fetchFormsInFolder(previousFolderId);
        navigate(`/dashboard/${userId}?folderId=${previousFolderId}`, { replace: true });
      } else {
        setSelectedFolderId(null);
        setSelectedFolderForms([]);
        navigate(`/dashboard/${userId}`, { replace: true });
      }
    }
  };

  const handleShare = () => {
    setIsSharePopupOpen(true);
  };

  const handleCloseSharePopup = () => {
    setIsSharePopupOpen(false);
  };
  const handleSelectChange = (event) => {
    const workspaceId = event.target.value;
    dispatch(setWorkspaceId(workspaceId)); // Dispatch the action with the selected ID
    console.log("Selected Workspace ID:", workspaceId);
  };



  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={`${styles.maindiv} open-sans`}>
      <nav className={styles.navbar}>
        <div
          className={styles.userDropdown}
          onClick={toggleDropdown}
          ref={buttonRef}
        >
          <span>{user.username}'s workspace</span>
          <span>
            <RiArrowDropDownLine size={"20px"} />
          </span>
        </div>
        {isDropdownVisible && (
          <div className={styles.dropdownMenu} ref={dropdownRef}>
          <select
                id="workspace-dropdown"
                value={selectedWorkspace}
                onChange={handleSelectChange}
            >
                {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                        {workspace.name}
                    </option>
                ))}
            </select>

            <div onClick={() => navigate("/settings")}>Settings</div>
            <div
              onClick={() => {
                handleLogout();
                navigate("/");
              }}
            >
              Log Out
            </div>
          </div>
        )}
        <div className={styles.controls}>
            <div className={styles.toggleContainer}>
              <span className={!isDark ? styles.activeLabel : styles.inactiveLabel}>
                Light
              </span>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  id="themeToggle"
                  checked={isDark}
                  onChange={toggleTheme}
                />
                <label htmlFor="themeToggle" className={styles.switchLabel}></label>
              </div>
              <span className={isDark ? styles.activeLabel : styles.inactiveLabel}>
                Dark
              </span>
            </div>
            <button className={styles.shareButton} onClick={handleShare}>Share</button>

          </div>
      </nav>
      <div className={styles.navLine}></div>
      <div className={styles.content}>
        <div className={styles.divone}>
          <div className={styles.folderOption} onClick={handleCreateFolderClick}>
            <FaFolderPlus /> Create a folder
          </div>
          {folders?.map((folder) => (
            <div
              className={`${styles.folderList} ${selectedFolderId === folder._id ? styles.selectedFolder : ""}`}
              key={folder._id}
              onClick={() => handleFolderClick(folder._id)}
              style={{ color: selectedFolderId === folder._id ? "#FFA54C" : "inherit" }}
            >
              <span>{folder.foldername}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolderClick(folder);
                }}
              >
                <RiDeleteBin6Line style={{cursor:"pointer"}} color="#F55050" />
              </span>
            </div>
          ))}
        </div>
        <div className={styles.typeBotContainer}>
          {selectedFolderId && (
            <div
              className={styles.shape}
              onClick={handleBackClick}
            >
              <IoArrowBack size={"30px"} color="white" />
            </div>
          )}
          <div onClick={handleCreateNewForm} className={styles.typeBotSquare}>
            <span>
              <IoAdd size={"20px"} />
            </span>
            <span>Create a TypeBot</span>
          </div>
          {selectedFolderId
            ? selectedFolderForms?.map((form) => (
              <div
                key={form._id}
                className={styles.formSquare}
                onClick={() => handleFormClick(form._id)}
              >
                <span>{form.formname}</span>
                <span
                  className={styles.formDeleteIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFormClick(form);
                  }}
                >
                  <RiDeleteBin6Line size={"24px"} color="#F55050" />
                </span>
              </div>
            ))
            : forms?.map((form) => (
              <div
                key={form._id}
                className={styles.formSquare}
                onClick={() => handleFormClick(form._id)}
              >
                <span>{form.formname}</span>
                <span
                  className={styles.formDeleteIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFormClick(form);
                  }}
                >
                  <RiDeleteBin6Line size={24} color="#F55050" />
                </span>
              </div>
            ))}
          {isCreateFolderVisible && (
            <div className={styles.createFolderPopup}>
              <h3>Create New Folder</h3>
              <input
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
              <div className={styles.createFolderActions}>
                <button onClick={handleCreateFolder}>Done</button>
                <button onClick={handleCancelCreateFolder}>Cancel</button>
              </div>
            </div>
          )}
          {isDeletePopupVisible && folderToDelete && (
            <div className={styles.deletePopup}>
              <h3>Are you sure you want to</h3>
              <h3>delete this folder?</h3>
              <div className={styles.deleteActions}>
                <button onClick={handleConfirmDeleteFolder}>Confirm</button>
                <button onClick={handleCancelDeleteFolder}>Cancel</button>
              </div>
            </div>
          )}
          {isDeletePopupVisible && formToDelete && (
            <div className={styles.deletePopup}>
              <h3>Are you sure you want to</h3>
              <h3>delete this form?</h3>
              <div className={styles.deleteActions}>
                <button onClick={handleConfirmDeleteForm}>Confirm</button>
                <button onClick={handleCancelDeleteForm}>Cancel</button>
              </div>
            </div>
          )}

        </div>
        {isSharePopupOpen && (
        <div className={styles.sharePopupOverlay}>
          <div className={styles.sharePopup}>
            {/* <h2>Invite by Email</h2>
            <input
              type="email"
              placeholder="Enter email"
              className={styles.shareInput}
            />
            <button className={styles.shareButton}>Send Invite</button>
            <h2>Invite by Link</h2>
            <button className={styles.copyLinkButton}>Copy Link</button>
            <button
              className={styles.closePopupButton}
              onClick={handleCloseSharePopup}
            >
              Close
            </button> */}
            <div className={styles.inviteContainer}>
        <span className={styles.closeBtn} onClick={handleCloseSharePopup}>&times;</span>
        <div className={styles.inviteHeader}>
            <h2>Invite by Email</h2>
            <div className={styles.dropdown}>
                <select
              defaultValue={permission}
              onChange={(e) => setPermissoin(e.target.value)}
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            </div>
        </div>
        <input type="text"  placeholder="Enter email id" onChange={(e) => setEmail(e.target.value)}/>
        <button onClick={handleSubmitShare}>Send Invite</button>
        <h2>Invite by link</h2>
        <button>Copy link</button>
    </div>
          </div>
        </div>
      )}
      </div>
      
    </div>
  );
}

export default Dashboard;