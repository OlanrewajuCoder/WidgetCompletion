import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./index.css";
const Verify: React.FunctionComponent = () => {
  interface OutletProps {
    list?: string;
  }
  const [isverify, setIsVerify] = useState<any>(false);
  useEffect(() => {
    if (localStorage.getItem("verify")) {
      setIsVerify(true);
    }
  }, []);

  const handleSyncClick = () => {
    setIsVerify(!isverify);
    localStorage.setItem("verify", "true");
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          {!isverify ? (
            <div className="sync-data-daily mb-2">
              <p className="syncmsg m-0 p-0">
                Email Verification Required. If you haven't received the
                verification email, please request a new one.
              </p>
              <button className="sync-button" onClick={handleSyncClick}>
                Verify Now
              </button>
            </div>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default Verify;
