import { useEffect, useState } from 'react';
import { setToLS, getFromLS } from '../utils/storage';
import _ from 'lodash';
import { useRecoilState } from "recoil";
import { dynamicCssState,selectedCssState } from "../state/atom"
import axios from "axios";

export const useTheme = () => {
    const [theme, setTheme] = useRecoilState(dynamicCssState);
    const [selectedCss, setselectedCss] = useRecoilState(selectedCssState);
    

    const [themeLoaded, setThemeLoaded] = useState(false);

    const setMode = mode => {
        setToLS('theme', mode)
        setTheme(mode);
    }; 

    const getFonts = () => {
        const allFonts = ['Lato', 'Roboto', 'Abel','Cursive'];
        return allFonts;
    }

    useEffect(() => {
        var themes;
            axios
              .get(
                process.env.REACT_APP_IDENTITY_ENDPOINT +
                  "IDENTITY/misc/getThemes"
              )
              .then(async (r) => {
                var themes;
                themes=r.data.themes;

                axios
                  .get(
                    process.env.REACT_APP_IDENTITY_ENDPOINT +
                      "IDENTITY/misc/getTheme"
                  )
                  .then(async (r) => {
                    const localTheme = r.data?.themes?.theme
                    localTheme ? setTheme(themes[localTheme]) : setTheme(themes.Light);
                    setThemeLoaded(true);
                  })
              })
              .catch((e) => {
                console.log("error", e);
              });
      
    }, []);
    
    return { theme, themeLoaded, setMode, getFonts };
};
