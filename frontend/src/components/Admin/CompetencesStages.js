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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

// Composant principal de la page des utilisateurs
const CompetencesStages = () => {
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
      const response = await axios.get("http://localhost:8000/skill");
      setData(response.data);
      //console.log(data, "dataaa");
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name:record.name,
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
        await axios.put(`http://localhost:8000/skill/${key}`, row);
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        await axios.post("http://localhost:8000/skill", row);
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
      await axios.delete(`http://localhost:8000/skill/${key}`);
      const newData = data.filter((item) => item._id !== key);
      setData(newData);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleAddSkill = () => {
    setIsModalVisible(true);
    form.resetFields(); // Réinitialise les champs du formulaire à l'ouverture du modal
  };
  // Fonction pour ajouter un nouveau utilisateur

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("http://localhost:8000/skill", values);
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
      title: "Nom de compétence",
      dataIndex: "name",
      width: "15%",
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
              title="Voulez-vous supprimer cette compétence?"
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
        Gestion des Compétences
      </Typography.Title>
      <Button
        type="primary"
        style={{
          float: "right",
          marginBottom: "20px",
          backgroundColor: "#ff735c",
        }}
        icon={<PlusOutlined />}
        onClick={handleAddSkill}
      >
        Ajouter une compétence
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
        title="Ajouter une compétence"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nom de la compétence"
            rules={[
              {
                required: true,
                message: "SVP entrez le nom de la compétence",
              },
            ]}
          >
            <Input />
          </Form.Item>
        
        </Form>
      </Modal>
    </>
  );
};

export default CompetencesStages;
