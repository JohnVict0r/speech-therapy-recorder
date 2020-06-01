import React, { useEffect, useState } from "react";
import "./App.css";

import {
  Layout,
  Menu,
  Breadcrumb,
  Typography,
  Form,
  Input,
  Button,
  Select,
  Radio,
  InputNumber,
  Steps,
  Row,
  Col,
  Divider,
  Tooltip,
  Progress,
  Alert,
} from "antd";

import {
  AudioOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Paragraph, Title } = Typography;
const { Option } = Select;
const { Step } = Steps;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

function App() {
  const [form] = Form.useForm();

  const [dados, setDados] = useState({});

  const [recording, setRecording] = useState(false);

  const [paRecord, setPaRecord] = useState(false);
  const [taRecord, setTaRecord] = useState(false);
  const [kaRecord, setKaRecord] = useState(false);
  const [patakaRecord, setPatakaRecord] = useState(false);

  const [step, setStep] = useState(0);
  const nextStep = () => {
    if (step === 2) return;
    setStep(step + 1);
  };
  const prevStep = () => {
    if (step === 0) return;
    setStep(step - 1);
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (recording & (progress < 100)) {
      setTimeout(() => setProgress(progress + 100 / 30), 1000);
    }
  }, [progress]);

  const onFinish = (values) => {
    setDados(values);
    nextStep();
  };

  const onReset = () => {
    form.resetFields();
  };

  const onRecorderAudio = (protocol) => {
    setRecording(true);
    setProgress(1);

    switch (protocol) {
      case "pa":
        setPaRecord(true);
        break;
      case "ta":
        setTaRecord(true);
        break;

      case "ka":
        setKaRecord(true);
        break;

      case "pataka":
        setPatakaRecord(true);
        break;
    }

    let mediaRecorder;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
      (stream) => {
        mediaRecorder = new MediaRecorder(stream);
        let chunks = [];
        mediaRecorder.ondataavailable = (data) => {
          chunks.push(data.data);
        };
        mediaRecorder.onstop = () => {
          const fileNameWav = `audio-${protocol}-${dados.class}-${dados.age}-${dados.gender}.wav`;
          const fileUrlWav = URL.createObjectURL(new Blob(chunks));

          const blob = new Blob(chunks, { type: "audio/ogg; code=opus" });
          const reader = new FileReader();

          if (reader.readAsDataURL) {
            reader.readAsDataURL(blob);
          } else if (reader.readAsDataurl) {
            reader.readAsDataurl(blob);
          }

          reader.onloadend = () => {
            const audioInputCurrent = document.getElementById(
              `audio-${protocol}`
            );

            const audio = document.createElement("audio");
            audio.src = reader.result;
            audio.controls = true;

            const div = document.createElement("div");
            const link = document.createElement("a");
            link.href = fileUrlWav;
            link.download = fileNameWav;
            link.text = "Download";

            const removeRecording = document.createElement("a");
            removeRecording.text = " | Remover";
            removeRecording.addEventListener(
              "click",
              () => {
                audio.remove();
                div.remove();
              },
              false
            );

            div.append(link);
            div.append(removeRecording);

            audioInputCurrent.append(audio);
            audioInputCurrent.append(div);

            setPaRecord(false);
            setTaRecord(false);
            setKaRecord(false);
            setPatakaRecord(false);
            setRecording(false);
          };
        };
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 30000);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {});

  const helpProtocolComponent = (protocol) => (
    <span>Protocolo {protocol.toUpperCase()}&nbsp;</span>
  );

  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Inicio</Menu.Item>
          <Menu.Item key="2">Sobre o projeto</Menu.Item>
          <Menu.Item key="3">Login</Menu.Item>
        </Menu> */}
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        <Breadcrumb style={{ margin: "16px 0" }} />
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380 }}
        >
          <Title>Base de dados</Title>
          <Paragraph>
            Este trabalho visa construir uma base de dados contendo gravações de
            áudios seguindo protocolos definidos pelo campo da fonoaudiologia
            com o objetivo de encontrar biomarcadores na fala dos pacientes que
            possuem ELA.
          </Paragraph>

          <Row>
            <Col xs={{ span: 22, offset: 2 }} lg={{ span: 6, offset: 9 }}>
              <Steps size="default" current={step}>
                <Step
                  title="Identificação"
                  description="Informar dados do voluntário"
                />
                <Step title="Gravação" description="Realizar os protocolos" />
                {/*  <Step title="Confirmar" description="Submeter dados" /> */}
              </Steps>
            </Col>
          </Row>

          {step === 0 && (
            <Form
              {...layout}
              form={form}
              name="control-hooks"
              onFinish={onFinish}
            >
              <Divider>
                <span>Informações</span>
              </Divider>
              <Form.Item
                name="gender"
                label="Sexo"
                rules={[{ required: true }]}
              >
                <Select placeholder="Selecione seu sexo" allowClear>
                  <Option value="male">Masculino</Option>
                  <Option value="female">feminino</Option>
                  <Option value="other">outro</Option>
                </Select>
              </Form.Item>

              <Form.Item name="age" label="Idade" rules={[{ required: true }]}>
                <InputNumber
                  min={1}
                  max={110}
                  placeholder="Informe sua idade em anos"
                />
              </Form.Item>

              <Form.Item
                name="class"
                label="Você é um paciente com ELA?"
                rules={[{ required: true }]}
                initialValue="Controle"
              >
                <Radio.Group>
                  <Radio value="Ela">Sim</Radio>
                  <Radio value="Controle">Não</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Próximo
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Limpar
                </Button>
              </Form.Item>
            </Form>
          )}

          {step === 1 && (
            <Form {...layout} form={form} name="control-hooks">
              <Divider>
                <span>Protocolos</span>
              </Divider>
              <Row>
                <Col xs={{ span: 22, offset: 2 }} lg={{ span: 10, offset: 7 }}>
                  <Alert
                    message="Orientações"
                    description={
                      <>
                        <Paragraph>
                          Ao clicar em gravar você deverá repetir o protocolo
                          escolhido durante 30 segundos. <br /> Sugerimos que
                          realize uma pausa para recuperar o fôlego entre as
                          gravações dos protocolos.
                          <br /> Sugerimos também que utilize um microfone
                          externo (fone de ouvido) para realizar uma gravação
                          melhor do áudio.
                        </Paragraph>{" "}
                      </>
                    }
                    type="info"
                  />
                </Col>
              </Row>

              <Form.Item
                name="protocolPA"
                label={helpProtocolComponent("pa")}
                rules={[{ required: true }]}
              >
                <Paragraph>Exemplo: PA PA PA PA PA...</Paragraph>
                <Button
                  onClick={() => onRecorderAudio("pa")}
                  disabled={recording}
                >
                  {paRecord & recording ? (
                    <LoadingOutlined />
                  ) : (
                    <AudioOutlined />
                  )}
                  Gravar
                </Button>
                {paRecord & recording ? (
                  <Progress percent={progress.toFixed(2)} />
                ) : (
                  <></>
                )}
                <div {...layout} id="audio-pa"></div>
              </Form.Item>

              <Form.Item
                name="protocolTA"
                label={helpProtocolComponent("ta")}
                rules={[{ required: true }]}
              >
                <Paragraph>Exemplo: TA TA TA TA TA...</Paragraph>
                <Button
                  onClick={() => onRecorderAudio("ta")}
                  disabled={recording}
                >
                  {taRecord & recording ? (
                    <LoadingOutlined />
                  ) : (
                    <AudioOutlined />
                  )}
                  Gravar
                </Button>
                {taRecord & recording ? (
                  <Progress percent={progress.toFixed(2)} />
                ) : (
                  <></>
                )}
                <div {...layout} id="audio-ta"></div>
              </Form.Item>

              <Form.Item
                name="protocolKA"
                label={helpProtocolComponent("ka")}
                rules={[{ required: true }]}
              >
                <Paragraph>Exemplo: KA KA KA KA KA...</Paragraph>
                <Button
                  onClick={() => onRecorderAudio("ka")}
                  disabled={recording}
                >
                  {kaRecord & recording ? (
                    <LoadingOutlined />
                  ) : (
                    <AudioOutlined />
                  )}
                  Gravar
                </Button>
                {kaRecord & recording ? (
                  <Progress percent={progress.toFixed(2)} />
                ) : (
                  <></>
                )}
                <div {...layout} id="audio-ka"></div>
              </Form.Item>

              <Form.Item
                name="protocolPATAKA"
                label={helpProtocolComponent("pataka")}
                rules={[{ required: true }]}
              >
                <Paragraph>Exemplo: PATAKA PATAKA PATAKA...</Paragraph>
                <Button
                  onClick={() => onRecorderAudio("pataka")}
                  disabled={recording}
                >
                  {patakaRecord & recording ? (
                    <LoadingOutlined />
                  ) : (
                    <AudioOutlined />
                  )}
                  Gravar
                </Button>
                {patakaRecord & recording ? (
                  <Progress percent={progress.toFixed(2)} />
                ) : (
                  <></>
                )}
                <div {...layout} id="audio-pataka"></div>
              </Form.Item>
              <Row>
                <Col xs={{ span: 22, offset: 2 }} lg={{ span: 10, offset: 7 }}>
                  <Alert
                    message="Submissão das gravações"
                    description={
                      <>
                        <Paragraph>
                          Ao finalizar a gravação dos 4 protocolos, realize o
                          download deles e envie para o seguinte email:
                          john.victor@lais.huol.ufrn.br
                        </Paragraph>{" "}
                      </>
                    }
                    type="info"
                  />
                </Col>
              </Row>
              <br />
              <br />
              <Form.Item {...tailLayout}>
                <Button htmlType="button" onClick={prevStep}>
                  Voltar
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Projeto biomarcadores na fala ©2020 desenvolvido pelo LAIS
      </Footer>
    </Layout>
  );
}

export default App;
