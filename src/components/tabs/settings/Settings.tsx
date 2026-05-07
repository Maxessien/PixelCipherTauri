import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSettings } from "../../../store/slices/appSlice";
import { Card } from "../encode/Encode";
import { SettingsSection, ToggleItem } from "./SettingsResuables";

const Settings = () => {
  const { settings } = useAppSelector((state) => state.app);
  const {
    autoCopyDecoded,
    language,
    theme,
  } = settings;
  const dispatch = useAppDispatch();

  return (
    <section className="w-full space-y-3">
      <h2 className="font-semibold text-2xl w-full text-center md:text-left">
        Settings
      </h2>

      <SettingsSection title="Behaviour and Appearance">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ToggleItem
            editVal={() =>
              dispatch(
                setSettings({ ...settings, autoCopyDecoded: !autoCopyDecoded }),
              )
            }
            subTitle="Automatically Copy decoded result to clipboard"
            value={autoCopyDecoded}
            title="Auto copy output"
          />
          <Card extraClassNames="space-y-2">
            <p className="text-base md:text-lg font-medium">Theme</p>
            <div className="flex w-full rounded-md border-2 border-(--text-secondary)">
              <button
                onClick={() =>
                  dispatch(setSettings({ ...settings, theme: "dark" }))
                }
                className={`flex-1 py-2 ${theme === "dark" ? "bg-(--main-primary)" : "hover:bg-(--main-tertiary)"}`}
              >
                Dark
              </button>
              <button
                onClick={() =>
                  dispatch(setSettings({ ...settings, theme: "light" }))
                }
                className={`flex-1 py-2 ${theme === "light" ? "bg-(--main-primary)" : "hover:bg-(--main-tertiary)"}`}
              >
                Light
              </button>
              <button
                onClick={() =>
                  dispatch(setSettings({ ...settings, theme: "system" }))
                }
                className={`flex-1 py-2 ${theme === "system" ? "bg-(--main-primary)" : "hover:bg-(--main-tertiary)"}`}
              >
                System
              </button>
            </div>
          </Card>
          <Card extraClassNames="space-y-2">
            <p className="text-base md:text-lg font-medium">Language</p>
            <select
              defaultValue={language}
              onChange={(e) =>
                dispatch(setSettings({ ...settings, language: e.target.value }))
              }
              className="w-full px-3 bg-(--main-tertiary-light) py-2 rounded-md shadow-[inset_0px_0px_10px_-5px_var(--text-primary-light)] text-base font-medium"
              name="lang"
              id="lang_select"
            >
              <option value="English">English</option>
            </select>
          </Card>
        </div>
      </SettingsSection>

      {/* <SettingsSection title="About"></SettingsSection> */}
    </section>
  );
};

export default Settings;
