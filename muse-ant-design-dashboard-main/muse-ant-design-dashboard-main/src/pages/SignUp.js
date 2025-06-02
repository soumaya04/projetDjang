import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useNavigate ,Link} from "react-router-dom";

const { Title } = Typography;

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const controllerRef = useRef(null);

  useEffect(() => {
    controllerRef.current = new AbortController();
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  const onFinish = async (values) => {
    const { username, email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      message.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8000/api/auth/register/",
        {
          username,
          email,
          password,
          password_confirmation: confirmPassword, // Vérifie que ton API attend bien ce champ
        },
        {
          signal: controllerRef.current.signal,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Inscription réussie !");
      navigate("/signin");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        const errData = error.response?.data;
        console.error("Erreur d'inscription:", errData || error.message);

        if (error.response?.status === 400 && errData) {
          if (errData.username) message.error(`Nom d'utilisateur : ${errData.username[0]}`);
           else if (errData.email) message.error(`Email : ${errData.email[0]}`);
          else if (errData.password) message.error(`Mot de passe : ${errData.password[0]}`);
          else message.error("Erreur dans les champs du formulaire.");
        } else if (error.response?.status === 500) {
          message.error("Erreur serveur - Veuillez réessayer plus tard");
        } else {
          message.error("Erreur lors de l'inscription");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 450,
        margin: "0 auto",
        paddingTop: 100,
        padding: 20,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: 8,
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
        Inscription
      </Title>
      <Form
        name="signup_form"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Nom d'utilisateur"
          name="username"
          rules={[{ required: true, message: "Veuillez entrer un nom d'utilisateur" }]}
          hasFeedback
        >
          <Input placeholder="Nom d'utilisateur" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Veuillez entrer un email" },
            { type: "email", message: "Email invalide" },
          ]}
          hasFeedback
        >
          <Input placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[
            { required: true, message: "Veuillez entrer un mot de passe" },
            { min: 6, message: "Le mot de passe doit contenir au moins 6 caractères" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Mot de passe" size="large" />
        </Form.Item>

        <Form.Item
          label="Confirmer le mot de passe"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: "Veuillez confirmer le mot de passe" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Les mots de passe ne correspondent pas."));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Confirmer le mot de passe" size="large" />
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
            S'inscrire
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
  <span>Déjà inscrit ? <Link to="/signin">Se connecter</Link></span>
</div>
    </div>
  );
};

export default SignUp;