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
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

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

const TabUtilisateurs = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users_admin");
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      nom: record.nom,
      prenom: record.prenom,
      email: record.email,
      role: record.role,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        await axios.put(`http://localhost:8000/users_admin/${key}`, row);
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        await axios.post("http://localhost:8000/users_admin", row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.error("Validation failed:", errInfo);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:8000/users_admin/${key}`);
      const newData = data.filter((item) => item.id !== key);
      setData(newData);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleAddUser = () => {
    setIsModalVisible(true);
    form.resetFields(); // Reset form fields when opening modal
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("http://localhost:8000/users_admin", values);
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

  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      width: "15%",
      editable: true,
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
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
            <a onClick={() => save(record.id)} style={{ marginRight: 8 }}>
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
              onConfirm={() => handleDelete(record.id)}
            >
              <a style={{ marginLeft: 8, color: "blue" }}>Supprimer</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

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
        style={{ float: "right", marginBottom: "20px" ,backgroundColor:"#ff735c"}}
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
            name="nom"
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
            name="prenom"
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
              <Option value="admin">Admin</Option>
              <Option value="RH">RH</Option>
              <Option value="validateur technique">Validateur Technique</Option>
              <Option value="etudiant">Étudiant</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TabUtilisateurs;
