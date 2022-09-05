interface StreamProps {
  messages: string[];
}

const Stream = ({ messages }: StreamProps) => {
  return (
    <div className="stream">
      {messages.map((message, index) => {
        let display = 'Invalid Entry'
        let id = 'error-in-stream'
        if (!(message === "")) {
          display = message
          id = 'result-message'
        }

        return (
          <div className="stream-unit" id={id} key={index}>
            {display}
          </div>
        );
      })}
    </div>
  );
};

export default Stream;
