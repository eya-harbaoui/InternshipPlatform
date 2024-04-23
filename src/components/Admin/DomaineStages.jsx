import React, { useState, useEffect } from 'react';
import { Form, Input, Popconfirm, Table, Typography, Button, Modal, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Flex } from 'antd';

const tagInputStyle = {
  width: 100,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};

const Domstages = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editingCompetences, setEditingCompetences] = useState({});
  const [addingCompetences, setAddingCompetences] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/Domaines');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      domainName: record.domainName,
      competences: record.competences.map((comp) => comp),
    });
    setEditingKey(record.id);
    setEditingCompetences({ ...editingCompetences, [record.id]: record.competences });
  };

  const cancel = () => {
    setEditingKey('');
    setEditingCompetences({});
    form.resetFields();
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
          competences: editingCompetences[key] || [],
        });
        await axios.put(`http://localhost:8000/Domaines/${key}`, {
          domainName: row.domainName,
          competences: newData[index].competences,
        });
        setData(newData);
        setEditingKey('');
        setEditingCompetences({});
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
        setEditingCompetences({});
      }
    } catch (errInfo) {
      console.log('Validation failed:', errInfo);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:8000/Domaines/${key}`);
      const newData = data.filter((item) => item.id !== key);
      setData(newData);
    } catch (error) {
      console.error('Error deleting domain:', error);
    }
  };

  const handleAddDomain = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        axios.post('http://localhost:8000/Domaines', {
          domainName: values.domainName,
          competences: addingCompetences,
        });
        fetchData();
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !addingCompetences.includes(inputValue)) {
      setAddingCompetences([...addingCompetences, inputValue]);
      setInputVisible(false);
      setInputValue('');
    }
  };

  const handleRemoveCompetence = (record, compToRemove) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.id === item.id);
    if (index > -1) {
      const item = newData[index];
      const updatedCompetences = item.competences.filter((comp) => comp !== compToRemove);
      newData.splice(index, 1, {
        ...item,
        competences: updatedCompetences,
      });
      setData(newData);
      setEditingCompetences({ ...editingCompetences, [record.id]: updatedCompetences });
    }
  };

  const handleEditCompetence = (record, index, newComp) => {
    const newData = [...data];
    const dataIndex = newData.findIndex((item) => record.id === item.id);
    if (dataIndex > -1) {
      const item = newData[dataIndex];
      const updatedCompetences = [...item.competences];
      updatedCompetences[index] = newComp;
      newData[dataIndex] = {
        ...item,
        competences: updatedCompetences,
      };
      setData(newData);
      setEditingCompetences({ ...editingCompetences, [record.id]: updatedCompetences });
    }
  };

  const handleAddCompetence = () => {
    if (inputValue && !addingCompetences.includes(inputValue)) {
      setAddingCompetences([...addingCompetences, inputValue]);
      setInputValue('');
    }
  };

  const handleEditDomainName = (record, newName) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.id === item.id);
    if (index > -1) {
      newData[index].domainName = newName;
      setData(newData);
    }
  };

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
    const inputNode = inputType === 'tags' ? <Input mode="tags" /> : <Input />;
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
                message: `SVP Ajoutez ${title}!`,
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

  const mergedColumns = [
    {
      title: 'Nom du domaine',
      dataIndex: 'domainName',
      width: '25%',
      editable: true,
      render: (text, record) => {
        return isEditing(record) ? (
          <Form.Item
            name="domainName"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Veuillez entrer le nom du domaine!' }]}
          >
            <Input value={text} onChange={(e) => handleEditDomainName(record, e.target.value)} />
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: 'Compétences requises',
      dataIndex: 'competences',
      width: '40%',
      editable: true,
      render: (competences, record) => (
        <>
          {isEditing(record) ? (
            <Flex gap="4px 0" wrap="wrap">
              {editingCompetences[record.id].map((comp, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveCompetence(record, comp)}
                  onClick={() => {
                    const newComp = prompt("Modifier la compétence", comp);
                    if (newComp !== null) {
                      handleEditCompetence(record, index, newComp);
                    }
                  }}
                >
                  {comp}
                </Tag>
              ))}
              {inputVisible && (
                <Input
                  style={tagInputStyle}
                  value={inputValue}
                  onChange={handleInputChange}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag
                  style={tagInputStyle}
                  onClick={() => setInputVisible(true)}
                  icon={<PlusOutlined />}
                >
                  Compétence
                </Tag>
              )}
            </Flex>
          ) : (
            <>
              {competences && competences.length > 0 ? (
                competences.map((comp, index) => <Tag key={index}>{comp}</Tag>)
              ) : (
                <span>Aucune compétence requise</span>
              )}
            </>
          )}
        </>
      ),
    },
    {
      title: 'Opération',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Enregistrer
            </Typography.Link>
            <Popconfirm title="Vous voulez annuler?" onConfirm={cancel}>
              <a>Annuler</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Modifier
            </Typography.Link>
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce domaine?"
              onConfirm={() => handleDelete(record.id)}
            >
              <a style={{ marginLeft: 8, color: 'blue' }}>Supprimer</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Typography.Title level={2} style={{ marginBottom: '20px' }}>
        Domaines et compétences
      </Typography.Title>
      <Button
        type="primary"
        style={{ float: 'right', marginBottom: '20px', backgroundColor: "#ff735c" }}
        icon={<PlusOutlined />}
        onClick={handleAddDomain}
      >
        Ajouter un domaine
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data.map((item, index) => ({
            ...item,
            key: item.id ?? index.toString(),
          }))}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Modal
        title="Ajouter un domaine"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="domainName"
            label="Nom du domaine"
            rules={[{ required: true, message: 'SVP entrez le nom du domaine' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="competences"
            label="Compétences requises"
            rules={[{ required: true, message: 'SVP entrez les compétences requises' }]}
          >
            <Flex gap="4px 0" wrap="wrap">
              {addingCompetences.map((comp) => (
                <Tag key={comp} closable onClose={() => setAddingCompetences(addingCompetences.filter(c => c !== comp))}>
                  {comp}
                </Tag>
              ))}
              {inputVisible && (
                <Input
                  style={tagInputStyle}
                  value={inputValue}
                  onChange={handleInputChange}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag
                  style={tagInputStyle}
                  onClick={() => setInputVisible(true)}
                  icon={<PlusOutlined />}
                >
                  Compétence
                </Tag>
              )}
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Domstages;
