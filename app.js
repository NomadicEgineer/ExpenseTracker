const btn = document.getElementById("addTransction");
const inputText  =document.getElementById("inputBox");
const inputAmt  = document.getElementById("inputAmt");
const balanceAmt = document.getElementById("balanceAmt");     // user balance displayed at top 
const historyDiv = document.querySelector(".history");
const content = document.querySelector(".content") 
const incAmt = document.getElementById("incAmt");             // income displayed at top 
const expAmt = document.getElementById("expAmt");             // expense displayed at top
const filter = document.querySelector(".filters");            // filter icon 
const select = document.getElementById("select");             // dropdown

let balance=0;
let income=0 , expense = 0;

btn.addEventListener("click",()=>{
    addTransaction();
    updateLocalStorage();
})

const addTransaction = (desc="",num="")=>{

        let text  = inputText.value;         
        let amount = inputAmt.value;

        if(desc!="" && num!=""){          // when page will reload if there is data in ls then update data here 
            text=desc;
            amount=num;
        }

    if(amount!=0){
        balance = balance + Number(amount);                    // calculating new balance

        balanceAmt.innerText=`$${balance}`;          // updating user balance 
        updateHistory(text,Number(amount));
        updateIncExp(Number(amount));

        inputText.value="";
        inputAmt.value="";
    }else{
        window.alert("Enter the details properly !")
    }

}

const updateHistory = (text,amount)=>{
    let newDiv = document.createElement("div");
    newDiv.classList.add("display_inc_exp");
    newDiv.innerHTML=` <p>${text}</p>
                        <p>${amount}</p>`;

    if(amount>0){ 
        newDiv.style.borderRight="8px solid green";
    }else{
        newDiv.style.borderRight="8px solid red";
    }

    content.append(newDiv)
    

}

const updateIncExp = (amount)=>{
    if(amount>0){
        income+=amount
        incAmt.innerText=`$${income}`;
    }else{
        expense+=amount
        expAmt.innerText=`-$${-expense}`;
    }
}

const updateLocalStorage =()=>{
    const display_inc_exp = document.querySelectorAll(".display_inc_exp");
    let arr=[];
    let nodeArr=Array.from(display_inc_exp);    // convert nodelist into array
    nodeArr.forEach((elem)=>{
        let subArr=[];
        subArr.push(elem.children[0].innerText)      
        subArr.push(elem.children[1].innerText)     
        arr.push(subArr)                          // push each transaction detail in array
    })
    localStorage.setItem("history",JSON.stringify(arr))      // updated in localStorage & convert array to string
}

// this function executes when page is refreshed 
(
    function(){
        let lsData=JSON.parse(localStorage.getItem("history"))    // converts string back into array
        // console.log(lsData)
        // calling addTransction function when local storage is not empty 
        if(lsData!=null){
            lsData.forEach((data)=>{
                // console.log(data)
                addTransaction(data[0],data[1])
            })
        }
    }
)()

filter.addEventListener("click",()=>{
    select.style.visibility="visible";
    // let selectArr=Array.from(select)
    // console.log(selectArr)
    // selectArr.forEach((option)=>{
    //     option.addEventListener("click",(event)=>{
    //         console.log(event)
    //     })
    // })


// the click event dosent works with select/option tags so always use change while using dropdown.

    select.addEventListener("change",(event)=>{

        const display_inc_exp = document.querySelectorAll(".display_inc_exp");
        const dispArr=Array.from(display_inc_exp);
        
        /* when we make display none of div then it is hidden from ui but still present in nodelist.
        but when we try to iterate nodelist it will not consider display none div while iterating. 
        Thus when the option is changed we should make display flex to all div to poperly iterate.*/

        dispArr.forEach((elem)=>{           
            elem.style.display="flex";         
        }) 

        if(event.target.value=="income"){
            dispArr.forEach((elem)=>{ 
                if(Number(elem.children[1].innerText)<0)          
                elem.style.display="none";         
            }) 
        }

        if(event.target.value=="expense"){
            dispArr.forEach((elem)=>{ 
                if(Number(elem.children[1].innerText)>0)          
                elem.style.display="none";         
            }) 
        }
        
        if(event.target.value=="All"){
            dispArr.forEach((elem)=>{           
                elem.style.display="flex";         
            }) 
        }
    })

})


