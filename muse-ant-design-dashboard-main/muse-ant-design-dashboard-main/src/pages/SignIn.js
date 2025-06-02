import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const controllerRef = useRef(null);

  useEffect(() => {
    controllerRef.current = new AbortController();
    const currentController = controllerRef.current;
    return () => {
      currentController.abort();
    };
  }, []);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/",
        {
          username: values.username, // bien username
          password: values.password,
        },
        {
          signal: controllerRef.current.signal,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      message.success("Connexion réussie !");
      navigate("/Home");
    } catch (error) {
      if (axios.isCancel(error) || error.name === "CanceledError") {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Erreur de connexion:", error.response?.data || error.message);
        if (error.response?.status === 401 || error.response?.status === 400) {
          message.error("Nom d'utilisateur ou mot de passe incorrect");
        } else if (error.response?.status === 500) {
          message.error("Erreur serveur - Veuillez réessayer plus tard");
        } else {
          message.error("Erreur de connexion");
        }
      }
    } finally {
      setLoading(false);
    }
  };
 


  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        paddingTop: 100,
        padding: 20,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: 8,
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
        Connexion
      </Title>
      <Form
        name="signin_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Nom d'utilisateur"
          name="username"
          rules={[{ required: true, message: "Veuillez entrer votre nom d'utilisateur" }]}
          hasFeedback
        >
          <Input placeholder="Nom d'utilisateur" size="large" />
        </Form.Item>

        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[
            { required: true, message: "Veuillez entrer votre mot de passe" },
            { min: 6, message: "Le mot de passe doit contenir au moins 6 caractères" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Mot de passe" size="large" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Se souvenir de moi</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
            style={{ marginTop: 10 }}
          >
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
