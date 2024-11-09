import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Logo from "@/components/Logo";
import Router from "next/router";
import LogoutImg from "@/public/logout.svg";
import Image from "next/image";
import { useState } from "react";

export default function Nav({ show }) {
  const inactiveLink = "flex gap-1 p-1 w-full";
  const activeLink = inactiveLink + " bg-highlight text-black rounded-sm w-48";
  const inactiveIcon = "w-6 h-6";
  const activeIcon = inactiveIcon + " text-primary";
  const router = useRouter();
  const { pathname } = router;
  const checkRole = JSON.parse(localStorage.getItem("session"));
  const [session, setSession] = useState(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    localStorage.removeItem("session");
    Router.reload();
  };

  return (
    <aside
      className={
        (show ? "left-0" : "-left-full") +
        " top-0 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all min-h-screen"
      }
      style={{ backgroundColor: "#A2D2DF" }}>
      <div className="left-nav h-full">
        <div>
          <div className="mb-4 mr-4 ">
            <Logo />
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={"/"}
              className={pathname === "/" ? activeLink : inactiveLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={pathname === "/" ? activeIcon : inactiveIcon}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-16 6h16M3 6v12h18V6H3z"
                />
              </svg>
              Quản Lý Hoạt Động
            </Link>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={"/ManageComputer"}
              className={
                pathname.includes("/ManageComputer") ? activeLink : inactiveLink
              }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={
                  pathname.includes("/ManageComputer")
                    ? activeIcon
                    : inactiveIcon
                }>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v8m8 4v1h-16v-1m8-8v-4M4 20h16"
                />
              </svg>
              Quản Lý Máy Tính
            </Link>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={"/CustomerList"}
              className={
                pathname.includes("/CustomerList") ? activeLink : inactiveLink
              }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={
                  pathname.includes("/CustomerList") ? activeIcon : inactiveIcon
                }>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4zM12 12a5 5 0 10-5-5 5 5 0 005 5z"
                />
              </svg>
              Quản Lý Khách Hàng
            </Link>
            {checkRole.role === "admin" ? (
              <Link
                style={{ textDecoration: "none", color: "black" }}
                href={"/ManageStaff"}
                className={
                  pathname.includes("/ManageStaff") ? activeLink : inactiveLink
                }>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={
                    pathname.includes("/ManageStaff")
                      ? activeIcon
                      : inactiveIcon
                  }>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v9m0 0l-2-2m2 2l2-2m1 9h-4v-1a2 2 0 10-4 0v1H5m16 0h-4v-1a2 2 0 00-4 0v1h-4"
                  />
                </svg>
                Quản Lý Nhân Viên
              </Link>
            ) : (
              ""
            )}
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={"/ManageTransactions"}
              className={
                pathname.includes("/ManageTransactions")
                  ? activeLink
                  : inactiveLink
              }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={
                  pathname.includes("/ManageTransactions")
                    ? activeIcon
                    : inactiveIcon
                }>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v8m8 4v1h-16v-1m8-8v-4M4 20h16"
                />
              </svg>
              Lịch Sử Giao Dịch
            </Link>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={"/thongke"}
              className={
                pathname.includes("/thongke") ? activeLink : inactiveLink
              }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={
                  pathname.includes("/thongke") ? activeIcon : inactiveIcon
                }>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h18v18H3V3z"
                />
              </svg>
              Thống Kê Doanh Thu
            </Link>
          </nav>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-2 py-2.5 text-center me-2 mb-2 flex">
            Log out
            <Image src={LogoutImg} width={20} height={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
