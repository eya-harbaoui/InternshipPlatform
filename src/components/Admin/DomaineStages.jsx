import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Space, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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

const Domstages = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      nom: '',
      prénom: '',
      email: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validation échouée:', errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleAddDomain = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newData = [...data];
        newData.push({
          key: newData.length.toString(),
          nomdomaine: values.nomDomaine,
          compétences: values.compétencesRequises,
        });
        setData(newData);
        setIsModalVisible(false);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Nom du domaine',
      dataIndex: 'nomdomaine',
      width: '25%',
      editable: true,
    },
    {
      title: 'Compétences requises',
      dataIndex: 'compétences',
      width: '40%',
      editable: true,
    },
    {
      title: 'opération',
      dataIndex: 'opération',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
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
              title="Êtes-vous sûr de vouloir supprimer cet utilisateur?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a style={{ marginLeft: 8, color: 'blue' }}>Supprimer</a>
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Typography.Title level={2} style={{ marginBottom: '20px' }}>Domaines et compétences</Typography.Title>
      <Button
        type="primary"
        style={{ float: 'right', marginBottom: '20px' }}
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
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nomDomaine"
            label="Nom du domaine"
            rules={[{ required: true, message: 'SVP entrez le nom du domaine' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="compétencesRequises"
            label="Compétences requises"
            rules={[{ required: true, message: 'SVP entrez les compétences requises' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Domstages;
