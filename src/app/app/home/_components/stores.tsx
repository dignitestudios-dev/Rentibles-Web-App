import React from "react";
import SwiperStores from "./swiper-stores";

const Stores = () => {
  const stores = [
    {
      _id: "68c42cc21e1affac1cafa5aa",
      name: "Test",
      email: "test23@yopmail.com",
      profilePicture:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
      coverPicture:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/3ed15500-e0a3-4cb1-a848-beb083529e11.png",
      createdAt: "2025-09-12T14:22:58.536Z",
      updatedAt: "2025-11-12T06:03:35.398Z",
    },
  ];
  return <SwiperStores stores={stores} />;
};

export default Stores;
