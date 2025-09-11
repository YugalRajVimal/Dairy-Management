import ComponentCard from "../../../components/common/ComponentCard";
import FileInput from "../../../components/form/input/FileInput";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";

export default function UploadExcelSheet() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <ComponentCard title="Upload Excel Sheet">
      <div>
        <Label>Upload file</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
        <Button className="my-8 w-40">Upload</Button>
      </div>
    </ComponentCard>
  );
}
