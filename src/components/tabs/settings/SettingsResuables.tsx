import { ReactNode } from "react";
import { Card } from "../encode/Encode";

const SettingsSection = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <Card extraClassNames="space-y-2">
      <h3 className="text-lg md:text-xl font-medium">{title}</h3>
      {children}
    </Card>
  );
};

const ToggleItem = ({
  editVal,
  subTitle,
  title,
  value,
}: {
  title: string;
  subTitle: string;
  value: boolean;
  editVal: () => void;
}) => {
  return (
    <Card extraClassNames="flex items-center">
      <div className="flex-1">
        <p className="text-base md:text-lg font-medium">{title}</p>
        <p className="text-sm text-(--text-secondary) md:text-base font-medium">
          {subTitle}
        </p>
      </div>
      <button
        onClick={editVal}
        style={{
          background: value ? "var(--main-primary)" : "text-secondary-light",
        }}
        className="w-5 h-3 rounded-full relative"
      >
        <span
          style={{ left: value ? "50%" : "0%" }}
          className="w-1/2 h-full bg-(--text-primary) absolute top-0"
        ></span>
      </button>
    </Card>
  );
};

export { SettingsSection, ToggleItem };
