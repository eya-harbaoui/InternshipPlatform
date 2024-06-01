import React, { useState } from "react";
import { Tag, Modal, Popover } from "antd";
import "./ListeCandidatureCard.css";
import { getStatusTag } from "./statusUtils";

const CandidatureCard = ({
  title,
  createdAt,
  status,
  statusRefusePopover,
  onClickTitle,
}) => {
  const { tagColor, tagText } = getStatusTag(status);

  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const popoverContent = (
    <div style={{ color: "red" }}>
      <p>{statusRefusePopover}</p>
    </div>
  );

  return (
    <>
      <div className="title-and-tag">
        <h3 onClick={onClickTitle}>{title}</h3>
        {status === "refusé" && (
          <Popover
            content={popoverContent}
            title="Motif du refus"
          >
            <Tag color={tagColor} className="status_tag" onClick={showModal}>
              {tagText}
            </Tag>
          </Popover>
        )}
        {status !== "refusé" && (
          <Tag color={tagColor} className="status_tag">
            {tagText}
          </Tag>
        )}
      </div>
      <p> Date de candidature : {createdAt}</p>
      <Modal
        title="Motif du refus"
        visible={modalVisible}
        onCancel={hideModal}
        footer={null}
      >
        <p>{statusRefusePopover}</p>
      </Modal>
    </>
  );
};

export default CandidatureCard;
