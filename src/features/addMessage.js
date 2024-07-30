import { setMessage } from "../reducers/message/messageSlice";

export default function addMessage(data, disp) {
  disp(
    setMessage({
      err: data.err,
      message: data.message.message,
      id: data.message.id,
    })
  );
}
