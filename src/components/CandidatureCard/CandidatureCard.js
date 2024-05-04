import React, { useState } from "react";
import { Tag, Modal, Popover } from "antd";
import "./ListeCandidatureCard.css";
import { getStatusTag } from "./statusUtils";

const CandidatureCard = ({
  Title,
  candidatureDate,
  candidatureStatus,
  statusRefusePopover,
  onClickTitle,
}) => {
  const { tagColor, tagText } = getStatusTag(candidatureStatus);

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
        <h3 onClick={onClickTitle}>{Title}</h3>
        {candidatureStatus === "refusé" && (
          <Popover
            content={popoverContent}
            title="Motif du refus"
          >
            <Tag color={tagColor} className="status_tag" onClick={showModal}>
              {tagText}
            </Tag>
          </Popover>
        )}
        {candidatureStatus !== "refusé" && (
          <Tag color={tagColor} className="status_tag">
            {tagText}
          </Tag>
        )}
      </div>
      <p> Date de candidature : {candidatureDate}</p>
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
