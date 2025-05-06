import React, { ReactNode, useContext, useState } from "react";

type replyType = string;

export interface ReplyContextType {
  reply: replyType;
  setReply: React.Dispatch<React.SetStateAction<replyType>>;
}

export const ReplyContext = React.createContext<ReplyContextType>({
  reply: "",
  setReply: () => {},
});

export const ReplyHolder = ({ children }: { children: ReactNode }) => {
  const [reply, setReply] = useState<replyType>("");

  return (
    <ReplyContext.Provider value={{ reply, setReply }}>
      {children}
    </ReplyContext.Provider>
  );
};


export const useReplyContext=()=>useContext(ReplyContext)