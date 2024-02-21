import React, {useState, useEffect, useRef } from 'react';
import axios from 'axios';

function BoardList(){
    const boardListStyle = {
        borderBottom : '1px solid #ddd'
    }
    const wordCut = { whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}
   
    //useState변수 선언[]
    //총레코드수를 처리할 변수
    const [totalRecord, setTotalRecord] = useState(40); //총레코드수 useState초기값 40개
    const [totalPage, setTotalPage] = useState(5); //총페이지
    const [nowPage, setNowPage] = useState(1);  //현재페이지

    const [pageList, setPageList] = useState([]); // 배열useState를 이용 ! json데이터를 담을 배열 [{}, {}, {}]
    const [pageNumber, setPageNumber] = useState([]);//페이지 번호들을 저장할 변수 (useState)

    // useEffect모듈을 이용하여 자동실행되도록 설정한다. (useEffect )
    const mounted = useRef(false);
    useEffect(()=>{
        if(!mounted.current){
            mounted.current=true;
        }else{
        getBoardList(1);
        }    
    }, []);

    //총레코드수, 총페이지수, 현재페이지, 해당레코드를 스프링가져오기 axios(get)
    function getBoardList(p){
        axios.get('http://localhost:9090/campus/axios/boardList?nowPage='+p)
        .then((response)=>{
            console.log(response); //[{}, {}, {}, {}, {}]
            //총레코드수
            setTotalRecord(response.data.pages.totalRecord);
            //총페이지수
            setTotalPage(response.data.pages.totalPage);
            //현재페이지수
            setNowPage(response.data.pages.nowPage);

            //선택한 레코드를 pageList에 담기
            //pageList에 담겨있는 레코드 5개 초기화
            setPageList([]);
            
            response.data.lists.map((record)=>{  //lists 반복map이용하여 
                setPageList((previous)=>{ //spread연산자이용 이전데이터 보존
                    //      이전데이터, 추가데이터
                    return [...previous, {no:record.no, subject:record.subject, 
                                    userid:record.userid, hit:record.hit, writedate:record.writedate}];
                });
            });
            //페이지 목록
            setPageNumber([]);//페이지 번호 초기화
            response.data.pageArr.map((pg)=>{
                if(pg<=totalPage) setPageNumber((pagePrevious)=>[...pagePrevious, pg]);
            });
            console.log('pageNumber', pageNumber);
        })
        .catch((error)=>{
            console.log(error);
        });
    }     
    //getBoardList(1);

    return(
        <div className="container">
            <h1>게시판 목록</h1>
            <div>총레코드수 : {totalRecord}, 총페이지수 : {totalPage}, 현재페이지 : {nowPage}</div>

            <div className="row" style={boardListStyle}>
                <div className="col col-sm-1 p-3">번호</div>
                <div className="col col-sm-5 p-3">제목</div>
                <div className="col col-sm-2 p-3">글쓴이</div>
                <div className="col col-sm-1 p-3">조회수</div>
                <div className="col col-sm-3 p-3">등록일</div>
            </div>

            {
                pageList.map((record)=>{   //컬렉션프레임워크 <List> 의 반복 .map
            
                    return(
                        <div className="row" style={boardListStyle}>
                            <div className="col col-sm-1 p-3">{record.no}</div>
                            <div className="col col-sm-5 p-3" style={wordCut}>{record.subject}</div>
                            <div className="col col-sm-2 p-3">{record.userid}</div>
                            <div className="col col-sm-1 p-3">{record.hit}</div>
                            <div className="col col-sm-3 p-3">{record.writedate}</div>
                        </div>
                    )
                })
            }
            {/* paging */}
           <ul className="pagination justify-content-center" style={{marginTop:'30px'}}>
               
                {/* 이전페이지 */}
                <li className="page-item">
                    <a class="page-link" href="javascript:void(0);" onClick={()=>getBoardList(nowPage-1)}>Previous</a>
                </li>     
                
                {/* 
                pageNumber의 값만큼 표시하기
                1 -> 1,2,3,4,5      9 -> 6,7,8,9,10 */}
                {
                pageNumber.map((nPage)=>{
                    var activeStyle = 'page-item';
                    if(nowPage==nPage) activeStyle = 'page-item active'; //bootstrap 의 페이징active추가

                    return(
                        <li className={activeStyle}><a class="page-link" href="javascript:void(0);" onClick={()=>getBoardList(nPage)}>
                            {nPage}</a></li>
                    )
                })
                }
                {/* 다음페이지 */}
                <li className="page-item">
                    <a class="page-link" href="javascript:void(0);" onClick={()=>getBoardList(nowPage+1)}>Next</a>
                </li>
            </ul>

        </div>
    )
}
export default BoardList;