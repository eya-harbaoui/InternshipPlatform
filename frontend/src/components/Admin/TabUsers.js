import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Modal,
  Select,
} from "antd";
import {PlusOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

// Composant pour les cellules éditables dans le tableau
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please enter ${title}!`,
            },
          ]}
        >
          {/* Si le champ à éditer est le rôle, affiche une liste déroulante */}
          {dataIndex === "role" ? (
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="RH">RH</Option>
              <Option value="validateur technique">Validateur Technique</Option>
              <Option value="etudiant">Étudiant</Option>
              <Option value="manager">Manager</Option>
            </Select>
          ) : (
            inputNode
          )}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

// Composant principal de la page des utilisateurs
const TabUtilisateurs = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fonction pour récupérer les données des utilisateurs depuis l'API
  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setData(response.data);
      //console.log(data, "dataaa");
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      password: record.password,
      phoneNumber: record.phoneNumber,
      role: record.role,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  // Fonction pour sauvegarder les modifications d'un utilisateur
  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log("key", key);
        await axios.put(`http://localhost:8000/users/${key}`, row);
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        await axios.post("http://localhost:8000/users", row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.error("Validation failed:", errInfo);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:8000/users/${key}`);
      const newData = data.filter((item) => item._id !== key);
      setData(newData);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleAddUser = () => {
    setIsModalVisible(true);
    form.resetFields(); // Réinitialise les champs du formulaire à l'ouverture du modal
  };
  // Fonction pour ajouter un nouveau utilisateur

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("http://localhost:8000/users", values);
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (errorInfo) {
      console.error("Validation failed:", errorInfo);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Configuration des colonnes du tableau
  const columns = [
    {
      title: "Nom",
      dataIndex: "firstName",
      width: "15%",
      editable: true,
    },
    {
      title: "Prénom",
      dataIndex: "lastName",
      width: "15%",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
      editable: true,
    },
    {
      title: "Numéro de téléphone",
      dataIndex: "phoneNumber",
      width: "25%",
      editable: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "25%",
      editable: true,
    },
    {
      title: "Opération",
      dataIndex: "operation",
      width: "25%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record._id)} style={{ marginRight: 8 }}>
              Enregistrer
            </a>
            <Popconfirm title="Voulez-vous annuler?" onConfirm={cancel}>
              <a>Annuler</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a disabled={editingKey !== ""} onClick={() => edit(record)}>
              Modifier
            </a>
            <Popconfirm
              title="Voulez-vous supprimer cet utilisateur?"
              onConfirm={() => handleDelete(record._id)}
            >
              <a style={{ marginLeft: 8, color: "blue" }}>Supprimer</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  // Ajoute la fonctionnalité d'édition aux colonnes éditables
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Typography.Title level={2} style={{ marginBottom: "20px" }}>
        Utilisateurs
      </Typography.Title>
      <Button
        type="primary"
        style={{
          float: "right",
          marginBottom: "20px",
          backgroundColor: "#ff735c",
        }}
        icon={<PlusOutlined />}
        onClick={handleAddUser}
      >
        Ajouter un utilisateur
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Modal
        title="Ajouter un utilisateur"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="Nom"
            rules={[
              {
                required: true,
                message: "SVP entrez le nom de l'utilisateur",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Prénom"
            rules={[
              {
                required: true,
                message: "SVP entrez le prénom de l'utilisateur",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "SVP entrez l'email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[{ required: true, message: "SVP entrez le mot de passe" }]}
          >
            <Input.Password
              placeholder="input password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Numéro de téléphone"
            rules={[
              { required: true, message: "SVP entrez le Numéro de téléphone" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "SVP entrez le role de l'utilisateur",
              },
            ]}
          >
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Assistant RH">Assistant RH</Option>
              <Option value="Responsable RH">Responsable RH</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Validator">Validator</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TabUtilisateurs;
