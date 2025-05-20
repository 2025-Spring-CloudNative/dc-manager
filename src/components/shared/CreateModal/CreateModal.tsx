import React, { useEffect, useState } from "react";
import styles from "./CreateModal.module.scss";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input/Input";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "number";
    placeholder?: string;
    required?: boolean;
    defaultValue?: string | number;
  }[];
  mutation: UseMutationResult<any, Error, any, unknown>;
  extraData?: Record<string, any>;
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  fields,
  mutation,
  extraData,
}) => {
  const [form, setForm] = useState<Record<string, string | number>>({});

  useEffect(() => {
    const initialForm: Record<string, string | number> = {};
    fields.forEach((f) => {
      initialForm[f.name] = f.defaultValue ?? (f.type === "number" ? 0 : "");
    });
    setForm(initialForm);
  }, [fields, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const hasEmptyRequired = fields.some(
      (f) => f.required && (form[f.name] === "" || form[f.name] === undefined)
    );
    if (hasEmptyRequired) return alert("請完整填寫表單");

    try {
      await mutation.mutateAsync({
        ...form,
        ...(extraData ?? {}),
      });
      onClose();
      onSuccess?.();
    } catch (err) {
      alert("提交失敗，請檢查輸入內容");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const isPending = mutation.status === "pending";

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.clearButton} onClick={onClose}>
          <XIcon className="w-5 h-[22px] text-gray-500" />
        </button>

        <div className={styles.titleArea}>
          <div className={styles.titleWrapper}>
            <Separator className={styles.leftSeparator} />
            <h2 className={styles.modalTitle}>{title}</h2>
            <Separator className={styles.rightSeparator} />
          </div>
        </div>

        <div className={styles.inputColumn}>
          {fields.map((field) => (
            <div key={field.name}>
              <label className={styles.inputFont}>{field.label}</label>
              <Input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder ?? `輸入${field.label}`}
                className={styles.inputField}
                value={form[field.name]?.toString() ?? ""}
                onChange={handleChange}
                min={field.type === "number" ? 1 : undefined}
              />
            </div>
          ))}
        </div>

        <div className={styles.modalActions}>
          <Button className={styles.saveButton} onClick={handleSubmit} disabled={isPending}>
            {isPending ? "儲存中..." : "確認"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;