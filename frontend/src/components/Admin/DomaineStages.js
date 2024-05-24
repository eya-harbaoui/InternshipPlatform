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
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

// Composant pour gérer les cellules éditables dans le tableau
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
  const [competences, setCompetences] = useState([]);

  // Récupérer les données : les domaines et les compétences correspondante à chaque domaine
  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:8000/skill");
      setCompetences(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await axios.get("http://localhost:8000/domain");
      const domainsWithSkillNames = response.data.map((domain) => {
        return {
          ...domain,
          skills: domain.skills.map((skillId) => {
            const skill = competences.find((c) => c._id === skillId);
            return skill ? skill.name : skillId;
          }),
        };
      });
      setData(domainsWithSkillNames);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchDomains();
  });

  //Ajout des compétences lors de l'ajout ou la modification d'un domaine

  const handleCompetenceChange = (value) => {
    setAddingCompetences(value);
    console.log(addingCompetences, "after adding");
  };
  //Quand on commence la modification

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: record.name,
      skills: record.skills,
    });
    setEditingKey(record._id);
    setEditRecord(record);
    setAddingCompetences(record.skills);
  };

  //Quand on annule la modification

  const cancel = () => {
    setEditingKey("");
    form.resetFields();
    setEditRecord(null);
    setAddingCompetences([]);
  };

  //Enregistrer une modification

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);

      const addingCompetencesWithIds = addingCompetences.map((skill) => {
        const competence = competences.find((c) => c.name === skill);
        return competence ? competence._id : null;
      });

      if (index > -1) {
        const item = newData[index];
        const updatedItem = {
          ...item,
          ...row,
          skills: addingCompetencesWithIds, // Ici, les IDs des compétences sont envoyés
        };

        newData.splice(index, 1, updatedItem);

        await axios.put(`http://localhost:8000/domain/${key}`, updatedItem);
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        await axios.post("http://localhost:8000/domain", {
          ...row,
          skills: addingCompetencesWithIds,
        });
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.error("Validation failed:", errInfo);
    }
  };
  //Modification des compétences d'un domaine existant (ajout, ou supression..)

  const handleEditModalOk = async () => {
    if (!editRecord) return;
    try {
      const updatedData = await form.validateFields();
      const addingCompetencesWithIds = addingCompetences.map((skill) => {
        const competence = competences.find((c) => c.name === skill);
        return competence ? competence._id : null;
      });
      await axios.put(`http://localhost:8000/domain/${editRecord._id}`, {
        ...editRecord,
        ...updatedData,
        skills: addingCompetencesWithIds,
      });
      setIsEditModalVisible(false);
      fetchDomains();
      form.resetFields();
      setAddingCompetences([]);
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };
  //Suppression d'un domaine

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:8000/domain/${key}`);
      const newData = data.filter((item) => item._id !== key);
      setData(newData);
    } catch (error) {
      console.error("Error deleting domain:", error);
    }
  };
  //Ouvrir le modal pour l'ajout d'un domaine

  const handleAddDomain = () => {
    setIsAddModalVisible(true);
    form.resetFields();
  };
  //Ajout d'un domaine

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("http://localhost:8000/domain", {
        name: values.name,
        skills: addingCompetences,
      });
      setIsAddModalVisible(false);
      fetchDomains();
      form.resetFields();
      setAddingCompetences([]);
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };
  //Annuler l'ajout d'un domaine

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    setAddingCompetences([]);
  };
  //Quand on commence la modifcation des compétences

  const handleEditCompetences = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
    setAddingCompetences(
      record.skills.map((skill) => {
        const competence = competences.find((c) => c.name === skill);
        return competence ? competence._id : skill;
      })
    );
    form.setFieldsValue({
      name: record.name,
      skills: record.skills,
    });
  };
  //Ouvrir le modal de modification des compétences

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setAddingCompetences([]);
  };

  //Les colonnes de la table

  const columns = [
    {
      title: "Nom du domaine",
      dataIndex: "name",
      width: "15%",
      editable: true,
    },
    {
      title: "Compétences Requises",
      dataIndex: "skills",
      width: "15%",
      render: (skills) => (
        <>{skills && skills.map((skill) => <Tag key={skill}>{skill}</Tag>)}</>
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
              title="Voulez-vous supprimer ce domaine?"
              onConfirm={() => handleDelete(record._id)}
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
        Gestion des Domaines
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
            name="name"
            label="Nom du domaine"
            rules={[{ required: true, message: "Veuillez entrer un nom" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="skills"
            label="Compétences"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner des compétences",
              },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Sélectionnez des compétences"
              onChange={handleCompetenceChange}
              value={addingCompetences}
            >
              {competences.map((competence) => (
                <Option key={competence._id} value={competence._id}>
                  {competence.name}
                </Option>
              ))}
            </Select>
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
            name="name"
            label="Nom du domaine"
            rules={[{ required: true, message: "Veuillez entrer un nom" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="skills"
            label="Compétences"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner des compétences",
              },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Sélectionnez des compétences"
              initialValue={editRecord ? editRecord.skills : []}
              onChange={handleCompetenceChange}
              value={addingCompetences}
            >
              {competences.map((competence) => (
                <Option key={competence.name} value={competence.name}>
                  {competence.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Domstages;
