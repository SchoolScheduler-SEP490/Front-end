const JoinCommunitySection = () => {
    return (
        <div className="flex justify-center items-center]">
      <section className="relative w-[70%] bg-primary-100 py-14 -mb-28">
        <div className="text-center max-w-2xl px-6 mx-auto z-10">
          {/* Heading */}
          <h2 className="text-primary-500 text-3xl lg:text-4xl font-semibold mb-4">
            Tham gia Cộng đồng Schedulify
          </h2>
  
          {/* Paragraph */}
          <p className="text-primary-500 text-base lg:text-lg mb-8">
            Cộng đồng <span className="font-semibold">Schedulify</span> là một
            cộng đồng lớn mạnh hỗ trợ các quý thầy cô trong quá trình sử dụng phần
            mềm, những thắc mắc và những mẹo hay giúp quá trình làm việc của thầy
            cô trở nên tuyệt vời hơn.
          </p>
  
          {/* CTA Button */}
          <button className="bg-white text-blue-900 font-semibold px-6 py-2 rounded shadow hover:bg-gray-200 transition-colors duration-300">
            Tham gia ngay
          </button>
        </div>
      </section>
        </div>
    );
  };
  
  export default JoinCommunitySection;
  