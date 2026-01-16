import { readLineperLine } from "../../admin/reader.js";

InstructorFileRead('./private/in/instructor.txt');

export function InstructorFileRead(source) {
    const content = readLineperLine(source);
    
    Object.values(content).forEach(line => {
        if (line.includes(';') === false && line.includes('{') === true) {
            
        } else {
            const lineContent = line.split(';')[0];
            console.log(lineContent);
        }
    })
}