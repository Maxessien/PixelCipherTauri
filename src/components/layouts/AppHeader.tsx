
const AppHeader = () => {
  return (
    <header>
      <div className="flex items-center w-full justify-start gap-2">
        <div className="flex items-center justify-center p-3 rounded-full">
          <img className="w-4" src="/pixelcipher.png" alt="logo" />
        </div>
        <h1 className="text-3xl font-semibold">Pixel Cipher</h1>
      </div>
    </header>
  );
};

export default AppHeader;
