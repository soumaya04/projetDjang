import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Descriptions,
  Radio,
  message,
  Skeleton,
} from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

import BgProfile from "../assets/images/bg-profile.jpg";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/current_user/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (isMounted) {
          setUserData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          message.error("Erreur lors du chargement du profil");
          console.error("Erreur API:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const pencil = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path
        d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
        className="fill-gray-7"
      ></path>
    </svg>
  );

  if (loading) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  if (!userData) {
    return <div>Erreur lors du chargement des données utilisateur</div>;
  }

  return (
    <>
      <div
        className="profile-nav-bg"
        style={{ backgroundImage: `url(${BgProfile})` }}
      ></div>

      <Card
        className="card-profile-head"
        bodyStyle={{ display: "none" }}
        title={
          <Row justify="space-between" align="middle" gutter={[24, 0]}>
            <Col span={24} md={12} className="col-info">
              <div className="avatar-info">
                <h4 className="font-semibold m-0">{userData.full_name}</h4>
                <p>{userData.user?.email}</p>
              </div>
            </Col>
            <Col
              span={24}
              md={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              
            </Col>
          </Row>
        }
      />

      <Row justify="center" gutter={[24, 0]}>
        <Col span={24} md={12} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">Informations du Profil</h6>}
            className="header-solid h-full card-profile-information"
            
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            <Descriptions title="Détails Personnels">
              <Descriptions.Item label="Nom Complet" span={3}>
                {userData.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Date de naissance" span={3}>
                {moment(userData.date_of_birth).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Téléphone" span={3}>
                {userData.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {userData.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Adresse" span={3}>
                {userData.address}
              </Descriptions.Item>
              
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Profile;
