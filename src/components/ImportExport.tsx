import { Button, VStack } from "@chakra-ui/react";
import { useBackend } from "./BackendBootstrapper";
import { LuDownload, LuUpload } from "react-icons/lu";

const ImportExport = () => {
  const backend = useBackend();

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blanked-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onExport = async () => {
    const data = await backend.exportData();
    downloadBlob(data);
  };

  const doImport = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data instanceof ArrayBuffer) {
          await backend.importData(new Blob([data]));
        }
      };
      reader.readAsArrayBuffer(file);
    };
    fileInput.click();
  };

  const onImport = async () => {
    const confirm = window.confirm(
      "This will overwrite your current database. Are you sure you want to continue?"
    );

    if (confirm) {
      await doImport();
    }
  };

  return (
    <VStack alignItems="stretch" w="full" mt="1">
      <Button onClick={onExport}>
        <LuDownload />
        Download Database Export
      </Button>

      <Button onClick={onImport}>
        <LuUpload />
        Restore from Database Export
      </Button>
    </VStack>
  );
};

export default ImportExport;
