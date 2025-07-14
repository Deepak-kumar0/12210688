export default async function log({stack,level,pack,message}){
   
 const content = {
    stack,level,package: pack,message
 }
let res = await fetch(`http://20.244.56.144/evaluation-service/logs`,{
    method: "POST",
    body: JSON.stringify(content),
});
let data = await res.json();
console.log(data);
}