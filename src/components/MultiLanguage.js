import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";

export default function MultiLanguage() {

    const { i18n } = useTranslation();

    useEffect(()=>{
        const choose = localStorage.getItem('lang');
        i18n.changeLanguage(choose);

    },[])

    let changeLanguageHandler = (e) =>{
        const choose = e.target.value ;
                
        i18n.changeLanguage(choose);
        localStorage.setItem("lang" , choose);
    }

    return (
        <>
            <div className="float-end  p-4">
                <select className="form-select" aria-label="Default select example" value={localStorage.getItem('lang')} onChange={changeLanguageHandler}>
                    <option value='en' >English</option>
                    <option value="hn">Hindi</option>
                    <option value="bn">Bangla</option>
                </select>
            </div>
        </>
    )
}