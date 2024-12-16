"use client";

import { ACCOUNT_STATUS } from "@/app/(admin)/_utils/constants";
import {
  IJWTTokenPayload,
  USER_ROLE_TRANSLATOR,
} from "@/app/(auth)/_utils/constants";
import SMHeader from "@/commons/school_manager/header";
import { useAppContext } from "@/context/app_provider";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useSWR from "swr";
import UpdateProfileModel from "./_componests/update-profile";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
  const { sessionToken, schoolName } = useAppContext();
  const decodedToken: IJWTTokenPayload = jwtDecode(sessionToken);
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const {
    data: accountData,
    isLoading,
    mutate,
  } = useSWR(
    decodedToken.accountId ? ["profile", decodedToken.accountId] : null,
    async () => {
      const response = await fetch(
        `${api}/api/accounts/${decodedToken.accountId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      const data = await response.json();
      return data.result;
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    }
  );
  console.log("id:%d", decodedToken.accountId);

  return (
    <div className="w-[84%] h-screen flex flex-col items-center overflow-y-scroll no-scrollbar">
      <SMHeader>
        <h3 className="text-title-small text-white font-semibold tracking-wider">
          Thông tin tài khoản
        </h3>
      </SMHeader>

      <div className="flex flex-col w-full h-full py-20">
        {!isLoading && accountData && (
          <div className="flex-1 w-full">
            <UpdateProfileModel
              accountData={accountData}
              accountId={decodedToken.accountId}
              mutate={mutate}
              onClose={setOpenUpdateModal}
              open={openUpdateModal}
            />
            <div className="w-full p-7 flex justify-center">
              {accountData && (
                <Grid container spacing={2} className="!flex justify-center">
                  <Grid item xs={12} md={5}>
                    <Card className="!w-full !shadow-md !border !border-gray-200 !rounded-lg">
                      <CardContent>
                        <div className="flex items-center mb-6 justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div
                              style={{
                                position: "relative",
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                border: "1px solid #888",
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                            >
                              <Avatar
                                
                                src={accountData["avatar-url"] || ""}
                                className="!w-16 !h-16 !mr-4"
                              />
                            </div>

                            <div>
                              <Typography
                                variant="h6"
                                className="!text-gray-800 !font-semibold"
                              >
                                {accountData["first-name"]}{" "}
                                {accountData["last-name"]}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="!text-gray-500"
                              >
                                {accountData["account-role"]
                                  .map(
                                    (r: string) => USER_ROLE_TRANSLATOR[r] ?? r
                                  )
                                  .join(", ")}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="!text-gray-500"
                              >
                                {schoolName}
                              </Typography>
                            </div>
                          </div>

                          <Button
                            variant="text"
                            onClick={() => setOpenUpdateModal(true)}
                            className="!text-primary-300 "
                          >
                            Cập nhật
                          </Button>
                        </div>

                        <Divider className="!my-4" />

                        {/* Personal Information Section */}
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography
                              variant="body2"
                              className="!text-gray-600 !mb-4"
                            >
                              <strong className="text-gray-800">
                                Họ Và Tên:
                              </strong>{" "}
                              {accountData["first-name"]}{" "}
                              {accountData["last-name"]}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              className="!text-gray-600 !mb-4"
                            >
                              <strong className="text-gray-800">
                                Vai trò:
                              </strong>{" "}
                              {accountData["account-role"]
                                .map(
                                  (r: string) => USER_ROLE_TRANSLATOR[r] ?? r
                                )
                                .join(", ")}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              className="!text-gray-600 !mb-4"
                            >
                              <strong className="text-gray-800">
                                Trạng thái:
                              </strong>{" "}
                              {ACCOUNT_STATUS[accountData["status"]]}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              className="!text-gray-600 !mb-4"
                            >
                              <strong className="text-gray-800">Email:</strong>{" "}
                              {accountData.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              className="!text-gray-500 !mb-4"
                            >
                              <strong className="text-gray-800">
                                Số điện thoại:
                              </strong>{" "}
                              {accountData.phone}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
