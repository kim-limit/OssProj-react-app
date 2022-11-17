import { Box, Grid, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MessageInput } from "../components/chat/message-input";
import { useCreateRoom } from "../hooks/use-create-room";
import { CreateRoomDialog } from "../components/chat/create-room-dialog";
import zang from "../assets/zang.png";
import bobobo from "../assets/bobobo.png";
import face from "../assets/face.png";
import { RoomListBox } from "../components/chat/room-list-box";
import { FloatingButton } from "../components/chat/floating-button";
import defaultImg from "../assets/defaultImg.png";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IChatDetail, IRoomProps } from "../interface/chat";
import { MenuButton } from "../components/commons/menu-button";
import ChatEntity from "../entity/Chat";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useRefresh } from "../hooks/use-refresing";
import { useNavigate } from "react-router-dom";
import { useConnectChat } from "../hooks/use-connect-chat";
import { useSendMessage } from "../hooks/use-send-message";
import { ChatMessageList } from "../components/chat/chat-message-list";
import { useHandleInputMessage } from "../hooks/use-handle-message";
import { useHandleChat } from "../hooks/use-handle-chat";
import { connect } from "http2";
import { useHandleImage } from "../hooks/use-handle-image";
import axios from "axios";
import { useUserState } from "../context/user-context";

const ROOM_SEQ = 1;
export const Chat = () => {
  const client = useRef<CompatClient>();
  const user = useUserState();
  const navigate = useNavigate();
  const [chatMessageList, setChatMessageList] = useState<IChatDetail[]>([
    {
      type: "ENTER",
      roomId: "sdf",
      sender: "scdf",
      message: "kim 입장",
    },
  ]);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [chatName, setChatName] = useState("");
  const [open, setOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [mockRoomList, setMockRoomList] = useState<IRoomProps[]>([
    { name: "1번방", roomId: "1", picturePath: face },
    { name: "2번방", roomId: "2", picturePath: zang },
    { name: "3번방", roomId: "3", picturePath: bobobo },
  ]);
  const [isChat, setIsChat] = useState(false);

  const handleDeleteRoomName = () => {
    setRoomName("");
  };
  const handleRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const {
    imgForm,
    fileImage,
    saveFileImage,
    deleteFileImage,
    createImageForm,
  } = useHandleImage();
  const { inputMessage, handleInputMessage, handleDeleteInputMessage } =
    useHandleInputMessage();
  const { createRoomHandler, data, isLoading, isSuccess } = useCreateRoom({
    name: roomName,
    image: "test image",
  });

  const { refreshHandler } = useRefresh();
  const { sendHandler, connectHandler } = useHandleChat({
    client: client.current!,
    sender: user.name,
    name: "1번방",
    message: inputMessage,
    roomId: roomId,
    chatMessages: chatMessageList,
    setChatMessageList: setChatMessageList,
    setRoomId: setRoomId,
    setChatName: setChatName,
    setIsChat: setIsChat,
    deleteMessage: handleDeleteInputMessage,
  });

  useEffect(() => {
    refreshHandler();
  }, []);
<<<<<<< HEAD
  const connect = (id: string) => {
    client.current = Stomp.over(() => {
      let sock = new SockJS("http://localhost:8080/ws-stomp");
      return sock;
    });
    client.current!.connect(
      {
        Authorization: axios.defaults.headers.common["Authorization"],
      },
      () => {
        client.current!.subscribe(
          `/sub/chat/room/1`,

          (message) => {
            setChatMessage(message.body);
          }
        );
      }
    );

    setChatName(id);
    setIsChat(true);
  };

  const sendMessage = () => {
    client.current!.send(
      "/pub/chat/message",
      {
        Authorization: axios.defaults.headers.common["Authorization"],
      },
      JSON.stringify({
        type: "TALK",
        roomId: "1",
        sender: "김재한",
        message: message,
      })
    );
    setMessage("");
  };
=======

>>>>>>> ea92582b94876202a0375e61a1a0b78aa7123d97
  return (
    <Grid
      container
      height={`100vh`}
      paddingTop={`50px`}
      paddingLeft={`100px`}
      paddingRight={`50px`}
      paddingBottom={`100px`}
      spacing={2}
      bgcolor={"#e5e5e5"}
      direction={{ lg: "row", md: "row", sm: "column", xs: "column" }}
    >
      {/* 메뉴 grid */}

      <Grid item lg={1} md={1} sm={1} xs={1}>
        <Box
          border={`1px solid black`}
          height={`100%`}
          width={`100%`}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <MenuButton
            onClick={() => {
              navigate("/");
            }}
          >
            <HomeIcon fontSize={"inherit"} />
          </MenuButton>
          <MenuButton
            onClick={() => {
              navigate("/mypage");
            }}
          >
            <AccountCircleIcon fontSize={"inherit"} />
          </MenuButton>
        </Box>
      </Grid>
      {/* room list grid */}
      {/* todo reverse list */}
      <Grid
        item
        container
        direction={"column"}
        position={"relative"}
        lg={3}
        md={3}
        sm={2}
        xs={2}
      >
        <Grid item container direction={"column"} lg={10} spacing={2}>
          <Grid item>
            <TextField
              sx={{ bgcolor: "white" }}
              fullWidth
              placeholder="채팅방 찾기"
            />
          </Grid>
          {user.rooms.map((room) => {
            return (
              <Grid item key={room.roomId}>
                <RoomListBox
                  roomName={room.name}
                  roomId={room.roomId}
                  selected={roomId}
                  img={room.picturePath}
                  user={""}
                  handleIsChat={connectHandler}
                  // todo sub, pub
                />
              </Grid>
            );
          })}
        </Grid>
        <Grid item lg={2}>
          <FloatingButton handleOpen={handleOpen} />
        </Grid>
      </Grid>
      {/* chatting room grid */}
      <Grid item lg={8} md={7} sm={5} xs={5} container>
        {/* todo sm xs */}
        {isChat ? (
          <Grid item container direction={"column"} spacing={1}>
            {/* message Grid */}
            <Grid item lg={11} md={11} sm={10} xs={10}>
              {chatName}
              <Box border={`1px solid black`} height={`95%`} bgcolor={"white"}>
                <ChatMessageList chatMessages={chatMessageList} />
              </Box>
            </Grid>
            {/* input grid */}
            <Grid item lg={1} md={1} sm={1} xs={1}>
              <MessageInput
                message={inputMessage}
                handleMessage={handleInputMessage}
                handleSend={sendHandler}
                handleDelete={handleDeleteInputMessage}
              />
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      <CreateRoomDialog
        roomName={roomName}
        open={open}
        handleRoomName={handleRoomName}
        handleClose={handleClose}
        createRoomHandler={createRoomHandler}
        handleDeleteRoomName={handleDeleteRoomName}
        img={fileImage === "" ? defaultImg : fileImage}
        handleImg={saveFileImage}
      />
    </Grid>
  );
};
