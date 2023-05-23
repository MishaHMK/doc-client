import { useTranslation, Trans } from 'react-i18next';
import "./footer.css";

const FooterContainer = () => {
  const { t, i18n } = useTranslation();
    return (
      <footer>
      <div className="footer-content">
        <h3 style = {{color: "white", fontFamily: "Arial Black" }}>{t("footer.title")}</h3>
        <p>
           {t("footer.createdby")}
        </p>
        <ul className="socials">
          <li>
            <a href="#">
              +38 000 00 00 000
            </a>
          </li>
          <li>
            <a href="#">
               {t("footer.adress")}
            </a>
          </li>
        </ul>
      </div>
    </footer>
    );
  };
  export default FooterContainer;