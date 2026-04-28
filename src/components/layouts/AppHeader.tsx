
const AppHeader = () => {
  return (
    <header>
      <div className="flex items-center px-3 sm:px-4 md:px-5 py-4 w-full justify-start gap-2">
        <div className="flex items-center bg-(--main-secondary) justify-center p-3 rounded-full">
          <img className="w-5" src="/pixelcipher.png" alt="logo" />
        </div>
        <h1 className="text-3xl font-semibold">Pixel Cipher</h1>
      </div>
    </header>
  );
};

export default AppHeader;
