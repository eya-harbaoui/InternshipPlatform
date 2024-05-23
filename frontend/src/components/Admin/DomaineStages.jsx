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
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Domstages = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [addingCompetences, setAddingCompetences] = useState([]);
  const [editRecord, setEditRecord] = useState(null);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Domaines");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      domainName: record.domainName,
    });
    setEditingKey(record.id);
    setEditRecord(record);
  };

  const cancel = () => {
    setEditingKey("");
    form.resetFields();
    setEditRecord(null);
  };

  const save = async (record) => {
    try {
      const updatedData = await form.validateFields([
        "domainName",
      ]); // Validation des champs du formulaire
      const newData = data.map((item) => {
        if (item.id === record.id) {
          return { ...item, ...updatedData };
        }
        return item;
      });
      await axios.put(`http://localhost:8000/Domaines/${record.id}`, {
        ...record,
        ...updatedData,
      }); // Appel réseau pour mettre à jour les données sur le serveur
      setData(newData); // Mise à jour de l'état local avec les nouvelles données
      setEditingKey(""); // Réinitialisation de l'état d'édition
      setEditRecord(null);
    } catch (errorInfo) {
      console.error("Validation failed:", errorInfo); // Gestion des erreurs de validation
      // Afficher un message d'erreur à l'utilisateur ou effectuer d'autres actions appropriées
    }
  };


  const handleEditModalOk = async () => {
    if (!editRecord) return;
    try {
      const updatedData = await form.validateFields();
      await axios.put(`http://localhost:8000/Domaines/${editRecord.id}`, {
        ...editRecord, // Envoyer toutes les données du record existant
        ...updatedData, // Mise à jour des données modifiées
      });
      fetchData();
      setIsEditModalVisible(false);
      form.resetFields();
      setAddingCompetences([]);
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };
  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:8000/Domaines/${key}`);
      const newData = data.filter((item) => item.id !== key);
      setData(newData);
    } catch (error) {
      console.error("Error deleting domain:", error);
    }
  };

  const handleAddDomain = () => {
    setIsAddModalVisible(true);
    form.resetFields(); // Réinitialiser les champs du formulaire lors de l'ouverture de la modalité
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("http://localhost:8000/Domaines", {
        domainName: values.domainName,
        competences: addingCompetences,
      });
      fetchData();
      setIsAddModalVisible(false);
      form.resetFields();
      setAddingCompetences([]);
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    setAddingCompetences([]);
  };

  const handleEditCompetences = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
    setAddingCompetences(record.competences);
    form.setFieldsValue({
      domainName: record.domainName,
    });
  };


  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setAddingCompetences([]);
  };

  const handleAddingCompetenceChange = (value) => {
    setAddingCompetences(value);
  };

  const columns = [
    {
      title: "Nom du domaine",
      dataIndex: "domainName",
      width: "15%",
      editable: true,
    },
    {
      title: "Compétences Requises",
      dataIndex: "competences",
      width: "15%",
      render: (competences) => (
        <>
          {competences &&
            competences.map((competence) => (
              <Tag key={competence}>{competence}</Tag>
            ))}
        </>
      ),
    },
    {
      title: "Opération",
      dataIndex: "operation",
      width: "25%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record)} style={{ marginRight: 8 }}>
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
            <a
              onClick={() => handleEditCompetences(record)}
              style={{ marginLeft: 8 }}
            >
              Modifier Compétences
            </a>
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
        Domaines et Compétences
      </Typography.Title>
      <Button
        type="primary"
        style={{
          float: "right",
          marginBottom: "20px",
          backgroundColor: "#ff735c",
        }}
        icon={<PlusOutlined />}
        onClick={handleAddDomain}
      >
        Ajouter un Domaine
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
        title="Ajouter un domaine"
        visible={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="domainName"
            label="Nom du domaine"
            rules={[
              {
                required: true,
                message: "SVP entrez le nom du domaine",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="competences"
            label="Compétences Requises"
            rules={[
              {
                required: true,
                message: "SVP entrez les compétences requises pour ce domaine",
              },
            ]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Ajouter compétences"
              onChange={handleAddingCompetenceChange}
              value={addingCompetences}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Modifier les compétences"
        visible={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="competences"
            label="Compétences Requises"
            initialValue={editRecord ? editRecord.competences : []}
            rules={[
              {
                required: true,
                message: "SVP entrez les compétences requises pour ce domaine",
              },
            ]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Modifier compétences"
              onChange={handleAddingCompetenceChange}
              value={addingCompetences}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Domstages;