import css from "./style.module.css";

export function Loader() {
  return (
    <div className={css.loader}>
      <div></div>
    </div>
  );
}

export default function LoaderWithDiv() {
  return (
    <div className="py-3 flex-center">
      <Loader />
    </div>
  );
}
