import React, { useState, useMemo } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Modal,
    RefreshControl,
    TouchableOpacity,
} from "react-native";
import { db } from "./firebaseConfig";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import "react-native-get-random-values";
import BarChart from "./BarChart";

export default function App() {
    const [newStudent, setNewStudent] = useState({
        docId: "",
        classID: "",
        fName: "",
        lName: "",
        DOB: "",
        className: "",
        Score: "",
        Grade: "",
    });

    const [students, setStudents] = useState([]);
    const [countsArray, setCountsArray] = useState([]);

    const editstudentVals = {
        docId: "",
        classID: "",
        fName: "",
        lName: "",
        DOB: "",
        className: "",
        Score: "",
        Grade: "",
    };

    const [editingStudent, setEditingStudent] = useState(editstudentVals);
    const [modalVisible, setModalVisible] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const studentsCollectionRef = collection(db, "Students");

    const createStudent = async () => {
        if (
            !newStudent.classID ||
            !newStudent.fName ||
            !newStudent.lName ||
            !newStudent.DOB ||
            !newStudent.className ||
            !newStudent.Score ||
            !newStudent.Grade
        ) {
            alert("Please enter more details for the student.");
            return;
        }

        if (
            newStudent.Grade !== "A" &&
            newStudent.Grade !== "B" &&
            newStudent.Grade !== "C" &&
            newStudent.Grade !== "D" &&
            newStudent.Grade !== "E" &&
            newStudent.Grade !== "F"
        ) {
            alert("Please enter a valid grade (A, B, C, D, E, or F).");
            return;
        }

        await addDoc(studentsCollectionRef, {
            classID: newStudent.classID,
            fName: newStudent.fName,
            lName: newStudent.lName,
            DOB: newStudent.DOB,
            className: newStudent.className,
            Score: newStudent.Score,
            Grade: newStudent.Grade,
        });

        setNewStudent(editstudentVals);
        await getStudents();
    };

    const deleteStudent = async (id) => {
        await deleteDoc(doc(db, "Students", id));

        await getStudents();
        // setStudents(students.filter((student) => student.id !== id));
    };

    // passer på at karakteren er gyldig
    const handleGradeInput = (value) => {
        const validGrades = ["A", "B", "C", "D", "E", "F"];
        if (validGrades.includes(value.toUpperCase()) && value !== "") {
            setNewStudent((prev) => ({
                ...prev,
                Grade: value,
            }));
        }
    };

    // teller totalt karakter fra alle klassene og setter de først i et objekt, deretter i et array
    const countGrades = (students) => {
        const gradeCounts = {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
        };

        for (let i = 0; i < students.length; i++) {
            gradeCounts[students[i].Grade]++;
        }

        const countsArray = Object.keys(gradeCounts).map((grade) => ({
            grade: grade,
            count: gradeCounts[grade],
        }));

        setCountsArray(countsArray);
    };

    const getStudents = async () => {
        try {
            const data = await getDocs(studentsCollectionRef);

            let _students = data.docs.map((doc) => {
                let props = doc.data();
                return {
                    docId: doc.id,
                    classID: props.classID,
                    fName: props.fName,
                    lName: props.lName,
                    DOB: props.DOB,
                    className: props.className,
                    Score: props.Score,
                    Grade: props.Grade,
                };
            });

            setStudents(_students);
            countGrades(_students);
        } catch (error) {
            console.error(error);
        }
    };

    const editStudent = async (editingStudent) => {
        await updateDoc(doc(db, "Students", editingStudent.docId), {
            classID: editingStudent.classID,
            fName: editingStudent.fName,
            lName: editingStudent.lName,
            DOB: editingStudent.DOB,
            className: editingStudent.className,
            Score: editingStudent.Score,
            Grade: editingStudent.Grade,
        });
        await getStudents();
    };

    const handleEditStudent = (students) => {
        if (students) {
            setEditingStudent(students);
            setModalVisible(true);
        }
    };

    const handleSaveEdit = async (editingStudent) => {
        await editStudent(editingStudent);
        setEditingStudent(editstudentVals);
        setModalVisible(!modalVisible);
    };

    const handleCancelEdit = () => {
        setEditingStudent(editstudentVals);
        setModalVisible(!modalVisible);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useMemo(async () => {
        await getStudents();
    }, []);

    return (
        <SafeAreaView>
            <StatusBar
                backgroundColor="#3b3a3a"
                barStyle="default"
                hidden={false}
            />
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ScrollView>
                    <View style={styles.boks}>
                        <TextInput
                            style={{ fontSize: 20, paddingBottom: 5 }}
                            placeholder="Class ID"
                            value={newStudent.classID}
                            onChangeText={(e) =>
                                setNewStudent((prev) => ({
                                    ...prev,
                                    classID: e,
                                }))
                            }
                        />
                        <TextInput
                            style={{ fontSize: 20, paddingBottom: 5 }}
                            placeholder="FirstName"
                            value={newStudent.fName}
                            onChangeText={(e) =>
                                setNewStudent((prev) => ({
                                    ...prev,
                                    fName: e,
                                }))
                            }
                        />
                        <TextInput
                            style={{ fontSize: 20, paddingBottom: 5 }}
                            placeholder="Lastname"
                            value={newStudent.lName}
                            onChangeText={(e) =>
                                setNewStudent((prev) => ({
                                    ...prev,
                                    lName: e,
                                }))
                            }
                        />
                        <TextInput
                            style={{ fontSize: 20, paddingBottom: 5 }}
                            placeholder="Date Of Birth"
                            keyboardType="numeric"
                            value={newStudent.DOB}
                            onChangeText={(e) =>
                                setNewStudent((prev) => ({
                                    ...prev,
                                    DOB: e,
                                }))
                            }
                        />
                        <TextInput
                            style={{ fontSize: 20, paddingBottom: 5 }}
                            placeholder="Class Name"
                            value={newStudent.className}
                            onChangeText={(e) =>
                                setNewStudent((prev) => ({
                                    ...prev,
                                    className: e,
                                }))
                            }
                        />
                        <TextInput
                            style={{ fontSize: 20, paddingBottom: 5 }}
                            placeholder="Score"
                            keyboardType="numeric"
                            value={newStudent.Score}
                            onChangeText={(e) =>
                                setNewStudent((prev) => ({
                                    ...prev,
                                    Score: e,
                                }))
                            }
                        />
                        <TextInput
                            style={{ fontSize: 20, paddingBottom: 5 }}
                            placeholder="Grade"
                            value={newStudent.Grade}
                            onChangeText={(e) => handleGradeInput(e)}
                            maxLength={1}
                        />
                        <Button
                            style={{ fontSize: 20 }}
                            color="#e88017"
                            title="Create Student"
                            onPress={createStudent}
                        />
                    </View>

                    <View
                        style={{
                            flex: 1,
                            margin: 20,
                            padding: 20,
                            borderWidth: 1,
                        }}
                    >
                        <Text
                            style={{
                                flex: 1,
                                textAlign: "center",
                                fontSize: 20,
                                paddingBottom: 20,
                            }}
                        >
                            Bar chart showing grade distribution
                        </Text>
                        <BarChart data={countsArray} />
                    </View>
                    <View>
                        <Text
                            style={{
                                flex: 1,
                                textAlign: "center",
                                fontSize: 20,
                                margin: 20,
                                padding: 20,
                            }}
                        >
                            Table showing the contents of students
                        </Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>
                                classID
                            </Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>
                                fName
                            </Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>
                                lName
                            </Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>
                                DOB
                            </Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>
                                className
                            </Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>
                                Score
                            </Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>
                                Grade
                            </Text>
                            <Text style={[styles.tableHeader, { flex: 2 }]}>
                                Actions
                            </Text>
                        </View>
                        {students.map((student) => (
                            <View style={styles.tableRow} key={student.docId}>
                                <Text style={styles.tableData}>
                                    {student.classID}
                                </Text>
                                <Text style={styles.tableData}>
                                    {student.fName}
                                </Text>
                                <Text style={styles.tableData}>
                                    {student.lName}
                                </Text>
                                <Text style={styles.tableData}>
                                    {student.DOB}
                                </Text>
                                <Text style={styles.tableData}>
                                    {student.className}
                                </Text>
                                <Text style={styles.tableData}>
                                    {student.Score}
                                </Text>
                                <Text style={styles.tableData}>
                                    {student.Grade}
                                </Text>
                                <View style={{ flex: 2 }}>
                                    <Button
                                        color="#31b1bd"
                                        title="Edit"
                                        onPress={() =>
                                            handleEditStudent(student)
                                        }
                                    />
                                    <Button
                                        color="#e81717"
                                        title="Del"
                                        onPress={() =>
                                            deleteStudent(student.docId)
                                        }
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </ScrollView>
            <Modal
                animationType="slide"
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View style={styles.modalView}>
                        <Text
                            style={{
                                fontSize: 20,
                                paddingBottom: 10,
                                textAlign: "center",
                            }}
                        >
                            You are editing the student "{editingStudent.fName}
                            ".
                        </Text>
                        <View style={styles.modalForm}>
                            <View
                                style={{ flexDirection: "row", paddingTop: 5 }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    Class ID:
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editingStudent.classID}
                                    onChangeText={(value) =>
                                        setEditingStudent({
                                            ...editingStudent,
                                            classID: value,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={{ flexDirection: "row", paddingTop: 5 }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    First Name:
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editingStudent.fName}
                                    onChangeText={(value) =>
                                        setEditingStudent({
                                            ...editingStudent,
                                            fName: value,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={{ flexDirection: "row", paddingTop: 5 }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    Last Name:
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editingStudent.lName}
                                    onChangeText={(value) =>
                                        setEditingStudent({
                                            ...editingStudent,
                                            lName: value,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={{ flexDirection: "row", paddingTop: 5 }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    Date of Birth:
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    keyboardType="numeric"
                                    value={editingStudent.DOB}
                                    onChangeText={(value) =>
                                        setEditingStudent({
                                            ...editingStudent,
                                            DOB: value,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={{ flexDirection: "row", paddingTop: 5 }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    Class Name:
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editingStudent.className}
                                    onChangeText={(value) =>
                                        setEditingStudent({
                                            ...editingStudent,
                                            className: value,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={{ flexDirection: "row", paddingTop: 5 }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    Score:
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    keyboardType="numeric"
                                    value={editingStudent.Score}
                                    onChangeText={(value) =>
                                        setEditingStudent({
                                            ...editingStudent,
                                            Score: value,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={{ flexDirection: "row", paddingTop: 5 }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    Grade:
                                </Text>
                                <TextInput
                                    style={styles.modalInput}
                                    value={editingStudent.Grade}
                                    onChangeText={(value) =>
                                        setEditingStudent({
                                            ...editingStudent,
                                            Grade: value,
                                        })
                                    }
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleCancelEdit()}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveButton}
                            color="green"
                            onPress={() => handleSaveEdit(editingStudent)}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fffceb",
        height: "100%",
        width: "100%",
    },
    textBoxes: {
        height: 40,
        margin: 12,
        borderWidth: 2,
        padding: 12,
        width: "90%",
        borderColor: "gray",
        frontSize: 18,
    },

    table: {
        alignItems: "stretch",
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 4,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    tableRow: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC",
    },
    tableHeader: {
        fontWeight: "bold",
    },
    tableData: {
        flex: 1,
    },
    boks: {
        margin: 30,
        padding: 15,
        borderWidth: 1,
        boxshadow: 20,
    },
    FocusEvent: {
        fontWeight: "bold",
    },
    modalView: {
        margin: 10,
        backgroundColor: "#e6e2d3",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalForm: {
        alignContent: "flex-start",
    },
    modalInput: {
        alignContent: "flex-end",
        fontSize: 20,
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    closeButton: {
        position: "absolute",
        top: -20,
        right: -20,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 100,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    saveButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "green",
        zIndex: 1,
    },
    saveButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
});