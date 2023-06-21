import IconImage from "../../../../../assets/static/icon.png";

const Header = function () {
  return (
    <div className="flex flex-col center space-y-6">
      <div className="w-20 h-20 flex center rounded-full bg-orange-8/5 border border-solid border-white/5 overflow-hidden">
        <figure className="translate-y-1">
          <img
            className="w-14 animate-bounce relative"
            src={IconImage}
            alt="VicioLauncher"
            draggable={false}
          />
        </figure>
      </div>
      <h3 className="text-sand-12 font-bold text-xl text-center uppercase">
        Entrar com
      </h3>
    </div>
  );
};

export default Header;
