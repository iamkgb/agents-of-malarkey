import "./brialle-loader.css";

const BrialleLoader = () => {
  return (
    <div className="loader">
      {Array.from({ length: 48 }).map((_, index) => (
        <div className="square" id={`sq${index + 1}`} key={index}></div>
      ))}
    </div>
  );
};

export default BrialleLoader;
