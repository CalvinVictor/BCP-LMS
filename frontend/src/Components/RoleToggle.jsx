import "./RoleToggle.css";

const roles = ["student", "instructor", "admin"];

const RoleToggle = ({ role, setRole }) => {
  return (
    <div className="role-toggle-container">
      <div className="role-toggle-track">
        <div className={`role-toggle-slider ${role}`}></div>
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            type="button"
            className={`role-toggle-option ${role === r ? "active" : ""}`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleToggle;
