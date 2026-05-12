import React, { useState, useEffect} from "react";
import { Button, Space } from "antd";
import { getSubs } from "../../functions/sub";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SubCategoryList = () => {
      const [subs, setSubs] = useState([]);
      const [loading, setLoading] = useState(false);

      const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getSubs().then((res)=>{
          setSubs(res.data);
          setLoading(false);
        });
      }, []);
  
 const showSubs = () =>
  subs.map((s) => (
    <div key={s._id}>
      <Button
        block
        style={{ marginBottom: 8 }}
        onClick={() => {
          navigate(`/sub/${s.slug}`);
        }}
      >
        {s.name}
      </Button>
    </div>
  ));


  return (
    <div style={{ margin: "10px 0" }}>
      <Space wrap>

      { loading ? <h4 className="text-center">Loading....</h4> :  showSubs() }

      </Space>
    </div>
  );
};

export default SubCategoryList;