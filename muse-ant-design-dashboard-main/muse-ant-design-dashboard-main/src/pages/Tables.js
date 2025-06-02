import { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  message,
  Button,
  Tag,
} from "antd";

import axios from 'axios';
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const Tables = () => {
  const [filter, setFilter] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/transactions/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("access_token")}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des transactions :", error);
      message.error("Impossible de charger les transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns = [
    {
      title: "TYPE DE TRANSACTION",
      dataIndex: "transaction_type",
      key: "transaction_type",
      width: "25%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <input
            placeholder="Rechercher par type"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Rechercher
          </Button>
          <Button onClick={() => {
            setSelectedKeys([]);
            confirm();
          }} size="small" style={{ width: 90 }}>
            Réinitialiser
          </Button>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.transaction_type.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "MONTANT",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => (
        <Tag color={amount >= 0 ? 'green' : 'red'}>
          {amount >= 0 ? `+${amount}` : amount} €
        </Tag>
      ),
    },
    {
      title: "DATE/HEURE",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    },
    {
      title: "LIEU",
      dataIndex: "location",
      key: "location",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <input
            placeholder="Rechercher par lieu"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Rechercher
          </Button>
          <Button onClick={() => {
            setSelectedKeys([]);
            confirm();
          }} size="small" style={{ width: 90 }}>
            Réinitialiser
          </Button>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.location.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => message.info(`Détails de la transaction: ${record.transaction_type} - ${record.amount}€`)}
        >
          Voir détails
        </Button>
      ),
    },
  ];

  const filteredData = transactions.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'credit') return item.amount >= 0;
    if (filter === 'debit') return item.amount < 0;
    return true;
  });

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Historique des Transactions"
            extra={
              <div style={{ display: 'flex', gap: '10px' }}>
                <Radio.Group 
                  onChange={(e) => setFilter(e.target.value)} 
                  defaultValue="all"
                  buttonStyle="solid"
                >
                  <Radio.Button value="all">Toutes</Radio.Button>
                  <Radio.Button value="credit">Crédits</Radio.Button>
                  <Radio.Button value="debit">Débits</Radio.Button>
                </Radio.Group>
                
                <Button 
                  icon={<FilterOutlined />}
                  onClick={() => {
                    message.info(`${selectedRowKeys.length} transaction(s) sélectionnée(s)`);
                  }}
                  disabled={!hasSelected}
                >
                  Actions ({selectedRowKeys.length})
                </Button>
              </div>
            }
          >
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                className="ant-border-space"
                rowSelection={rowSelection}
                loading={loading}
                rowKey="id"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Tables;
