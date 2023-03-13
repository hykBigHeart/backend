import { Button } from "antd";
import { useSelector } from "../../store/hooks";

interface PropInterface {
  type: "link" | "text" | "primary" | "default";
  text: string;
  p: string;
  class: string;
  icon: any;
  onClick: () => void;
  disabled: any;
}

export const PerButton = (props: PropInterface) => {
  const permisssions = useSelector((state: any) => state.permisssions);
  const through = () => {
    if (!permisssions) {
      return false;
    }
    return typeof permisssions[props.p] !== "undefined";
  };
  return (
    <>
      {through() && props.type === "link" && (
        <Button
          className={props.class}
          type="link"
          danger
          icon={props.icon}
          onClick={() => {
            props.onClick();
          }}
          disabled={props.disabled}
        >
          {props.text}
        </Button>
      )}
      {through() && props.type !== "link" && (
        <Button
          className={props.class}
          type={props.type}
          icon={props.icon}
          onClick={() => {
            props.onClick();
          }}
          disabled={props.disabled}
        >
          {props.text}
        </Button>
      )}
    </>
  );
};
