import { useRecoilValue } from "recoil";
import { formbuilderErrorsState } from "../../state/atom";

export default function useErrorValue() {
  const formbuilderErrors = useRecoilValue(formbuilderErrorsState);

  let totalErrorsNumber = 0;
  let totalWarningsNumber = 0;

  Object.entries(formbuilderErrors).map(([key, value]) => {
    Object.entries(value).map(([key, value]) => {
      Object.entries(value).map(([key, value]) => {
        totalErrorsNumber = totalErrorsNumber + value.length;
      });
    });
  });

  return { totalErrorsNumber, totalWarningsNumber };
}
