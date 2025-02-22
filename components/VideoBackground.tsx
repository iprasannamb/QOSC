const VideoBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover opacity-70"
      >
        <source src="/quantum-bg3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground; 