import { Layout } from "antd";
import moment from "moment";

const FooterContainer = () => {
    return (
      <Layout.Footer style = {{backgroundColor: '#051643', height: '80px'}}>
        <div>
          <a href="https://www.facebook.com">
                Facebook
          </a>
          <a href="https://twitter.com">
                Twitter
          </a>
          <a href="https://www.instagram.com">
                Instagram
          </a>
        </div>
        <p>
          Humeniuk Mykhailo © {moment().format("YYYY")}
        </p>
      </Layout.Footer>
    );
  };
  export default FooterContainer;