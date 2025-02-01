"use client";
//Global
import React from "react";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import { SHOP_NAME } from "@/utils/Consts";
//Styles
import "./politics.scss";

const Politics = () => {
  const translate = useTranslate();

  return (
    <main className="politics-wrapper">
      <div className="politics-content">
        <div className="politics-content_header">

          <h5 className="politics-content_header-title">{SHOP_NAME}</h5>

          <h5 className="politics-content_header-span">
            {translate.footerPolitics}
          </h5>

        </div>
        <div className="politics-content_wrapper pb-20">
      
    
        <p className="politics-content_translate pb-3 pt-3 font-bold">{translate["politics.1"]}</p>
          <p className="politics-content_translate">{translate["politics.1.1"]}</p>
          <p className="politics-content_translate">{translate["politics.1.2"]}</p>

          <p className="politics-content_translate pb-3 pt-3 font-bold">{translate["politics.2"]}</p>
          <p className="politics-content_translate">{translate["politics.2.1"]}</p>
          <p className="politics-content_translate">{translate["politics.2.2"]}</p>
          <p className="politics-content_translate">{translate["politics.2.3"]}</p>
          <p className="politics-content_translate">{translate["politics.2.4"]}</p>
          <p className="politics-content_translate">{translate["politics.2.5"]}</p>
          <p className="politics-content_translate">{translate["politics.2.6"]}</p>
          <p className="politics-content_translate">{translate["politics.2.7"]}</p>
          <p className="politics-content_translate">{translate["politics.2.8"]}</p>
          <p className="politics-content_translate">{translate["politics.2.9"]}</p>
          <p className="politics-content_translate">{translate["politics.2.10"]}</p>
          <p className="politics-content_translate">{translate["politics.2.11"]}</p>

          <p className="politics-content_translate pb-3 pt-3 font-bold">{translate["politics.3"]}</p>
          <p className="politics-content_translate">{translate["politics.3.1"]}</p>
          <p className="politics-content_translate">{translate["politics.3.2"]}</p>
          <p className="politics-content_translate">{translate["politics.3.3"]}</p>
          <p className="politics-content_translate">{translate["politics.3.4"]}</p>
          <p className="politics-content_translate">{translate["politics.3.5"]}</p>
          <p className="politics-content_translate">{translate["politics.3.6"]}</p>
          <p className="politics-content_translate">{translate["politics.3.7"]}</p>
          <p className="politics-content_translate">{translate["politics.3.8"]}</p>
          <p className="politics-content_translate">{translate["politics.3.9"]}</p>
          <p className="politics-content_translate">{translate["politics.3.10"]}</p>

          <p className="politics-content_translate pb-3 pt-3 font-bold">{translate["politics.4"]}</p>
          <p className="politics-content_translate">{translate["politics.4.1"]}</p>

          <p className="politics-content_translate pb-3 pt-3 font-bold">{translate["politics.5"]}</p>
          <p className="politics-content_translate">{translate["politics.5.1"]}</p>
   
        </div>
      </div>
    </main>
  );
};

export default Politics;
