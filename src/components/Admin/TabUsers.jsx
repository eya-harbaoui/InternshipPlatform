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

const TabUtilisateurs = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      nom: '',
      prenom: '',
      Email: '',
      Role: '',
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
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          role: values.role,
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
      title: 'Nom',
      dataIndex: 'nom',
      width: '15%',
      editable: true,
    },
    {
      title: 'Prénom',
      dataIndex: 'prenom',
      width: '15%',
      editable: true,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: '20%',
        editable: true,
      },
      {
        title: 'Role',
        dataIndex: 'role',
        width: '25%',
        editable: true,
      },
    {
      title: 'opération',
      dataIndex: 'opération',
      width: '35%',
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
              title="Êtes-vous sûr de vouloir supprimer ce domaine?"
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
      <Typography.Title level={2} style={{ marginBottom: '20px' }}> Utilisateurs</Typography.Title>
      <Button
        type="primary"
        style={{ float: 'right', marginBottom: '20px' }}
        icon={<PlusOutlined />}
        onClick={handleAddDomain}
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
            name="Nom"
            label="nom"
            rules={[{ required: true, message: 'SVP entrez le nom de l'/'utilisateur' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Prénom"
            label="prenom"
            rules={[{ required: true, message: 'SVP entrez le prénom de l'/'utilisateur' }]}
          >
            <Input />
            </Form.Item>
            <Form.Item
            name="Email"
            label="email"
            rules={[{ required: true, message: 'SVP entrez l'/'email' }]}
          >
            <Input />
            </Form.Item>
          <Form.Item
            name="Role"
            label="role"
            rules={[{ required: true, message: 'SVP entrez le role de l'/'utilisateur' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TabUtilisateurs;
